import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { getServices, getBlogPosts } from "@/lib/content-store";

const baseUrl = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/services",
    "/about",
    "/blog",
    "/reviews",
    "/login",
    "/signup",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/cookie-policy",
  ];

  const services = await getServices();
  const servicePages = services.map((s) => `/${s.slug}`);

  const posts = await getBlogPosts();
  const blogPages = posts.map((post) => `/blog/${post.slug}`);

  return [...staticPages, ...servicePages, ...blogPages].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
