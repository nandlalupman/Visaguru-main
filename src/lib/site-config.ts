import { getAllSiteConfigs } from "@/lib/content-store";
import {
  caseStudies as defaultCaseStudies,
  expertProfile as defaultExpertProfile,
  mediaLogos as defaultMediaLogos,
  navLinks as defaultNavLinks,
  problemCards as defaultProblemCards,
  processSteps as defaultProcessSteps,
  socialProofTicker as defaultSocialProofTicker,
  trustDestinations as defaultTrustDestinations,
  trustStats as defaultTrustStats,
} from "@/lib/site-data";

export type EditableLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type FooterLinkGroup = {
  title: string;
  links: EditableLink[];
};

export type ContactLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  platform: string;
  href: string;
};

export type SiteShellConfig = {
  brandName: string;
  brandSince: string;
  brandTagline: string;
  footerDescription: string;
  footerDisclaimer: string;
  headerNavLinks: EditableLink[];
  headerLogin: EditableLink;
  headerPrimaryCta: EditableLink;
  footerLinkGroups: FooterLinkGroup[];
  footerContactLinks: ContactLink[];
  footerSocialLinks: SocialLink[];
  footerBottomText: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterButton: string;
  newsletterPlaceholder: string;
};

export type HomeContentConfig = {
  heroTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTrustMessage: string;
  problemCards: { title: string; description: string }[];
  statCallout: string;
  processSteps: { title: string; day: string; description: string }[];
  trustStats: { value: string; label: string }[];
  trustDestinations: string[];
  expertProfile: {
    name: string;
    role: string;
    experience: string;
    summary: string;
  };
  mediaLogos: string[];
  caseStudies: { title: string; timeline: string; before: string; after: string }[];
  socialProofTicker: string[];
  googleReviewsUrl: string;
};

export type ServiceSharedConfig = {
  trustStats: { value: string; label: string }[];
  processSteps: { title: string; day: string; description: string }[];
};

const DEFAULT_HEADER_LOGIN: EditableLink = {
  href: "/login",
  label: "Login",
};

const DEFAULT_HEADER_CTA: EditableLink = {
  href: "/#free-analysis",
  label: "Free Refusal Analysis",
};

const DEFAULT_FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Services",
    links: [
      { href: "/uk-visa", label: "UK Visa" },
      { href: "/canada-visa", label: "Canada Visa" },
      { href: "/schengen-visa", label: "Europe Visa" },
      { href: "/germany-visa", label: "Germany Visa" },
      { href: "/australia-visa", label: "Australia Visa" },
      { href: "/fresh-sop", label: "Fresh SOP Writing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/about#team", label: "Our Team" },
      { href: "/blog", label: "Blog" },
      { href: "/reviews", label: "Reviews" },
      { href: "/login", label: "Login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/refund-policy", label: "Refund Policy" },
      { href: "/cookie-policy", label: "Cookie Policy" },
    ],
  },
];

const DEFAULT_FOOTER_CONTACTS: ContactLink[] = [
  { label: "Email", href: "mailto:hello@visaguru.live" },
  { label: "WhatsApp", href: "https://wa.me/917737099474" },
  { label: "Phone", href: "tel:+917737099474" },
];

const DEFAULT_FOOTER_SOCIALS: SocialLink[] = [
  { platform: "LinkedIn", href: "https://www.linkedin.com" },
  { platform: "Instagram", href: "https://www.instagram.com" },
  { platform: "YouTube", href: "https://www.youtube.com" },
];

const DEFAULT_HOME_HERO_TITLE = "Your Visa Was Rejected. Here's How We Fix It.";
const DEFAULT_HOME_HERO_SUBTITLE =
  "We analyze your refusal letter, rebuild your SOP, and give visa officers exactly what they need to say yes. 500+ cases, 94% approval rate.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstDefined(configs: Record<string, unknown>, keys: readonly string[]): unknown {
  for (const key of keys) {
    const value = configs[key];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

function parseString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function parseStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return parsed.length > 0 ? parsed : fallback;
}

function parseLinks(value: unknown, fallback: EditableLink[]): EditableLink[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value
    .map((item) => {
      if (!isRecord(item)) return null;
      if (typeof item.href !== "string" || typeof item.label !== "string") return null;
      return {
        href: item.href,
        label: item.label,
        external: Boolean(item.external),
      };
    })
    .filter((item): item is EditableLink => item !== null);
  return parsed.length > 0 ? parsed : fallback;
}

function parseLink(value: unknown, fallback: EditableLink): EditableLink {
  if (!isRecord(value)) return fallback;
  if (typeof value.href !== "string" || typeof value.label !== "string") return fallback;
  return {
    href: value.href,
    label: value.label,
    external: Boolean(value.external),
  };
}

function parseFooterGroups(value: unknown, fallback: FooterLinkGroup[]): FooterLinkGroup[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value
    .map((item) => {
      if (!isRecord(item) || typeof item.title !== "string") return null;
      const links = parseLinks(item.links, []);
      if (links.length === 0) return null;
      return {
        title: item.title,
        links,
      };
    })
    .filter((item): item is FooterLinkGroup => item !== null);
  return parsed.length > 0 ? parsed : fallback;
}

function parseContactLinks(value: unknown, fallback: ContactLink[]): ContactLink[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value
    .map((item) => {
      if (!isRecord(item)) return null;
      if (typeof item.label !== "string" || typeof item.href !== "string") return null;
      return { label: item.label, href: item.href };
    })
    .filter((item): item is ContactLink => item !== null);
  return parsed.length > 0 ? parsed : fallback;
}

function parseSocialLinks(value: unknown, fallback: SocialLink[]): SocialLink[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value
    .map((item) => {
      if (!isRecord(item)) return null;
      if (typeof item.platform !== "string" || typeof item.href !== "string") return null;
      return { platform: item.platform, href: item.href };
    })
    .filter((item): item is SocialLink => item !== null);
  return parsed.length > 0 ? parsed : fallback;
}

function parseTrustStats(
  value: unknown,
  fallback: { value: string; label: string }[],
): { value: string; label: string }[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value
    .map((item) => {
      if (!isRecord(item)) return null;
      if (typeof item.value !== "string" || typeof item.label !== "string") return null;
      // Respect the "visible" toggle from admin Stats panel
      if (item.visible === false) return null;
      return { value: item.value, label: item.label };
    })
    .filter((item): item is { value: string; label: string } => item !== null);
  return parsed.length > 0 ? parsed : fallback;
}

function parseProcessSteps(
  value: unknown,
  fallback: { title: string; day: string; description: string }[],
): { title: string; day: string; description: string }[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value
    .map((item) => {
      if (!isRecord(item)) return null;
      if (
        typeof item.title !== "string" ||
        typeof item.day !== "string" ||
        typeof item.description !== "string"
      ) {
        return null;
      }
      return {
        title: item.title,
        day: item.day,
        description: item.description,
      };
    })
    .filter((item): item is { title: string; day: string; description: string } => item !== null);
  return parsed.length > 0 ? parsed : fallback;
}

function parseProblemCards(
  value: unknown,
  fallback: { title: string; description: string }[],
): { title: string; description: string }[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value
    .map((item) => {
      if (!isRecord(item)) return null;
      if (typeof item.title !== "string" || typeof item.description !== "string") return null;
      return { title: item.title, description: item.description };
    })
    .filter((item): item is { title: string; description: string } => item !== null);
  return parsed.length > 0 ? parsed : fallback;
}

function parseExpertProfile(
  value: unknown,
  fallback: { name: string; role: string; experience: string; summary: string },
): { name: string; role: string; experience: string; summary: string } {
  if (!isRecord(value)) return fallback;
  if (
    typeof value.name !== "string" ||
    typeof value.role !== "string" ||
    typeof value.experience !== "string" ||
    typeof value.summary !== "string"
  ) {
    return fallback;
  }
  return {
    name: value.name,
    role: value.role,
    experience: value.experience,
    summary: value.summary,
  };
}

function parseCaseStudies(
  value: unknown,
  fallback: { title: string; timeline: string; before: string; after: string }[],
): { title: string; timeline: string; before: string; after: string }[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value
    .map((item) => {
      if (!isRecord(item)) return null;
      if (
        typeof item.title !== "string" ||
        typeof item.timeline !== "string" ||
        typeof item.before !== "string" ||
        typeof item.after !== "string"
      ) {
        return null;
      }
      return {
        title: item.title,
        timeline: item.timeline,
        before: item.before,
        after: item.after,
      };
    })
    .filter((item): item is { title: string; timeline: string; before: string; after: string } => item !== null);
  return parsed.length > 0 ? parsed : fallback;
}

export function resolveSiteShellConfig(configs: Record<string, unknown>): SiteShellConfig {
  const headerNavLinks = parseLinks(firstDefined(configs, ["header_nav_links", "nav_links", "navLinks"]), defaultNavLinks);
  const headerPrimaryCta = parseLink(firstDefined(configs, ["header_cta", "headerCta"]), DEFAULT_HEADER_CTA);
  const headerLogin = parseLink(firstDefined(configs, ["header_login", "headerLogin"]), DEFAULT_HEADER_LOGIN);

  return {
    brandName: parseString(firstDefined(configs, ["brand_name", "brandName"]), "VisaGuru"),
    brandSince: parseString(firstDefined(configs, ["brand_since", "brandSince"]), "Since 2020"),
    brandTagline: parseString(
      firstDefined(configs, ["brand_tagline", "brandTagline"]),
      "Turning Visa Rejections Into Approvals Since 2020.",
    ),
    footerDescription: parseString(
      firstDefined(configs, ["footer_description", "footerDescription"]),
      "Premium refusal-recovery strategy for students, workers, and tourists.",
    ),
    footerDisclaimer: parseString(
      firstDefined(configs, ["footer_disclaimer", "footerDisclaimer"]),
      "We are document preparation specialists. We do not provide legal advice. For complex immigration matters, consult a licensed immigration lawyer.",
    ),
    headerNavLinks,
    headerLogin,
    headerPrimaryCta,
    footerLinkGroups: parseFooterGroups(
      firstDefined(configs, ["footer_link_groups", "footerLinkGroups"]),
      DEFAULT_FOOTER_LINK_GROUPS,
    ),
    footerContactLinks: parseContactLinks(
      firstDefined(configs, ["footer_contact_links", "footerContactLinks"]),
      DEFAULT_FOOTER_CONTACTS,
    ),
    footerSocialLinks: parseSocialLinks(
      firstDefined(configs, ["footer_social_links", "footerSocialLinks"]),
      DEFAULT_FOOTER_SOCIALS,
    ),
    footerBottomText: parseString(
      firstDefined(configs, ["footer_bottom_text", "footerBottomText"]),
      "© 2026 VisaGuru | Registered in India (CIN: U12345MH2020PTC123456) | Not affiliated with any government embassy or immigration authority.",
    ),
    newsletterTitle: parseString(
      firstDefined(configs, ["newsletter_title", "newsletterTitle"]),
      "Get visa tips in your inbox",
    ),
    newsletterSubtitle: parseString(
      firstDefined(configs, ["newsletter_subtitle", "newsletterSubtitle"]),
      "Actionable refusal-recovery guides, no spam.",
    ),
    newsletterButton: parseString(
      firstDefined(configs, ["newsletter_button", "newsletterButton"]),
      "Subscribe",
    ),
    newsletterPlaceholder: parseString(
      firstDefined(configs, ["newsletter_placeholder", "newsletterPlaceholder"]),
      "you@example.com",
    ),
  };
}

export function resolveHomeContentConfig(configs: Record<string, unknown>): HomeContentConfig {
  return {
    heroTagline: parseString(
      firstDefined(configs, ["hero_tagline", "heroTagline"]),
      "Premium Visa Refusal Recovery",
    ),
    heroTitle: parseString(
      firstDefined(configs, ["hero_title", "heroTitle"]),
      DEFAULT_HOME_HERO_TITLE,
    ),
    heroSubtitle: parseString(
      firstDefined(configs, ["hero_subtitle", "heroSubtitle"]),
      DEFAULT_HOME_HERO_SUBTITLE,
    ),
    heroTrustMessage: parseString(
      firstDefined(configs, ["hero_trust_message", "heroTrustMessage"]),
      "Expert SOP Writing for All Major Destinations",
    ),
    problemCards: parseProblemCards(
      firstDefined(configs, ["problem_cards", "problemCards"]),
      [...defaultProblemCards],
    ),
    statCallout: parseString(
      firstDefined(configs, ["stat_callout", "statCallout"]),
      "In 2023, Canada alone rejected approximately 320,000 study permit applications.",
    ),
    processSteps: parseProcessSteps(
      firstDefined(configs, ["process_steps", "processSteps"]),
      [...defaultProcessSteps],
    ),
    trustStats: parseTrustStats(
      firstDefined(configs, ["trust_stats", "trustStats"]),
      [...defaultTrustStats],
    ),
    trustDestinations: parseStringArray(
      firstDefined(configs, ["trust_destinations", "trustDestinations"]),
      [...defaultTrustDestinations],
    ),
    expertProfile: parseExpertProfile(
      firstDefined(configs, ["expert_profile", "expertProfile"]),
      { ...defaultExpertProfile },
    ),
    mediaLogos: parseStringArray(
      firstDefined(configs, ["media_logos", "mediaLogos"]),
      [...defaultMediaLogos],
    ),
    caseStudies: parseCaseStudies(
      firstDefined(configs, ["case_studies", "caseStudies"]),
      [...defaultCaseStudies],
    ),
    socialProofTicker: parseStringArray(
      firstDefined(configs, ["social_proof_ticker", "socialProofTicker"]),
      [...defaultSocialProofTicker],
    ),
    googleReviewsUrl: parseString(
      firstDefined(configs, ["google_reviews_url", "googleReviewsUrl"]),
      "https://www.google.com/maps",
    ),
  };
}

export function resolveServiceSharedConfig(configs: Record<string, unknown>): ServiceSharedConfig {
  return {
    trustStats: parseTrustStats(
      firstDefined(configs, ["trust_stats", "trustStats"]),
      [...defaultTrustStats],
    ),
    processSteps: parseProcessSteps(
      firstDefined(configs, ["process_steps", "processSteps"]),
      [...defaultProcessSteps],
    ),
  };
}

export async function getSiteShellConfig(): Promise<SiteShellConfig> {
  return resolveSiteShellConfig(await getAllSiteConfigs());
}

export async function getHomeContentConfig(): Promise<HomeContentConfig> {
  return resolveHomeContentConfig(await getAllSiteConfigs());
}

export async function getServiceSharedConfig(): Promise<ServiceSharedConfig> {
  return resolveServiceSharedConfig(await getAllSiteConfigs());
}
