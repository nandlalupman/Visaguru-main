import { prisma } from "@/lib/prisma";

// ── Type helpers for JSON fields ────────────────────────────────

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// ── Public types (used by frontend components) ──────────────────

export type CmsService = {
  id: string;
  slug: string;
  flag: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  price: string;
  reasonStats: string[];
  differentiators: string[];
  pricing: { analysis: string; fullRecovery: string; express: string };
  testimonials: { name: string; role: string; feedback: string }[];
  faq: { id: string; question: string; answer: string }[];
};

export type CmsTestimonial = {
  id: string;
  name: string;
  country: string;
  role: string;
  date: string;
  feedback: string;
  rating: number;
  featured: boolean;
};

export type CmsVideo = {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  country: string;
  featured: boolean;
};

export type CmsBlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: { heading: string; paragraphs: string[] }[];
  publishedAt: string;
  readTime: string;
  cta: string;
  status: string;
};

export type CmsFaqItem = {
  id: string;
  question: string;
  answer: string;
  serviceId: string | null;
};

export type CmsPricingTier = {
  id: string;
  name: string;
  price: string;
  note: string;
  features: string[];
  popular: boolean;
  amountInr: number;
};

// ── Services ────────────────────────────────────────────────────

export async function getServices(): Promise<CmsService[]> {
  const rows = await prisma.siteService.findMany({
    where: { published: true },
    include: { faqItems: { where: { published: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    flag: r.flag,
    title: r.title,
    subtitle: r.subtitle,
    description: r.description,
    accent: r.accent,
    price: r.price,
    reasonStats: parseJson<string[]>(r.reasonStats, []),
    differentiators: parseJson<string[]>(r.differentiators, []),
    pricing: { analysis: r.pricingAnalysis, fullRecovery: r.pricingFull, express: r.pricingExpress },
    testimonials: parseJson<{ name: string; role: string; feedback: string }[]>(r.testimonials, []),
    faq: r.faqItems.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
  }));
}

export async function getServiceBySlug(slug: string): Promise<CmsService | null> {
  const r = await prisma.siteService.findUnique({
    where: { slug },
    include: { faqItems: { where: { published: true }, orderBy: { sortOrder: "asc" } } },
  });
  if (!r) return null;

  return {
    id: r.id,
    slug: r.slug,
    flag: r.flag,
    title: r.title,
    subtitle: r.subtitle,
    description: r.description,
    accent: r.accent,
    price: r.price,
    reasonStats: parseJson<string[]>(r.reasonStats, []),
    differentiators: parseJson<string[]>(r.differentiators, []),
    pricing: { analysis: r.pricingAnalysis, fullRecovery: r.pricingFull, express: r.pricingExpress },
    testimonials: parseJson<{ name: string; role: string; feedback: string }[]>(r.testimonials, []),
    faq: r.faqItems.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
  };
}

// ── Testimonials ────────────────────────────────────────────────

export async function getTestimonials(): Promise<CmsTestimonial[]> {
  const rows = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) => ({
    id: r.id, name: r.name, country: r.country, role: r.role,
    date: r.date, feedback: r.feedback, rating: r.rating, featured: r.featured,
  }));
}

// ── Video Testimonials ──────────────────────────────────────────

export async function getVideoTestimonials(): Promise<CmsVideo[]> {
  const rows = await prisma.videoTestimonial.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) => ({
    id: r.id, title: r.title, thumbnailUrl: r.thumbnailUrl,
    videoUrl: r.videoUrl, country: r.country, featured: r.featured,
  }));
}

// ── Blog Posts ───────────────────────────────────────────────────

export async function getBlogPosts(): Promise<CmsBlogPost[]> {
  const rows = await prisma.blogPostEntry.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id, slug: r.slug, title: r.title, description: r.description,
    content: parseJson<{ heading: string; paragraphs: string[] }[]>(r.content, []),
    publishedAt: r.publishedAt, readTime: r.readTime, cta: r.cta, status: r.status,
  }));
}

export async function getBlogPostBySlug(slug: string): Promise<CmsBlogPost | null> {
  const r = await prisma.blogPostEntry.findUnique({ where: { slug } });
  if (!r) return null;
  return {
    id: r.id, slug: r.slug, title: r.title, description: r.description,
    content: parseJson<{ heading: string; paragraphs: string[] }[]>(r.content, []),
    publishedAt: r.publishedAt, readTime: r.readTime, cta: r.cta, status: r.status,
  };
}

// ── FAQ Items ───────────────────────────────────────────────────

export async function getGlobalFaqItems(): Promise<CmsFaqItem[]> {
  const rows = await prisma.faqItem.findMany({
    where: { serviceId: null, published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) => ({ id: r.id, question: r.question, answer: r.answer, serviceId: null }));
}

// ── Pricing Tiers ───────────────────────────────────────────────

export async function getPricingTiers(): Promise<CmsPricingTier[]> {
  const rows = await prisma.pricingTier.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) => ({
    id: r.id, name: r.name, price: r.price, note: r.note,
    features: parseJson<string[]>(r.features, []), popular: r.popular, amountInr: r.amountInr,
  }));
}

// ── Site Config ─────────────────────────────────────────────────

export async function getSiteConfig(key: string): Promise<unknown> {
  const row = await prisma.siteConfig.findUnique({ where: { key } });
  return row ? parseJson(row.value, null) : null;
}

export async function getAllSiteConfigs(): Promise<Record<string, unknown>> {
  const rows = await prisma.siteConfig.findMany();
  const result: Record<string, unknown> = {};
  for (const row of rows) {
    result[row.key] = parseJson(row.value, null);
  }
  return result;
}
