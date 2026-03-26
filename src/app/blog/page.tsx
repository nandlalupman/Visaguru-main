import Link from "next/link";
import { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { getBlogPosts } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "Visa Refusal Blog",
  description:
    "Expert guides on SOP writing after refusal, financial letters, and country-specific reapplication strategy.",
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <Reveal>
          <p className="inline-flex rounded-full bg-[#fff7ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
            SEO Knowledge Hub
          </p>
          <h1 className="mt-5 text-4xl text-[var(--color-navy)] md:text-6xl">
            Visa Refusal Recovery Blog
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)]">
            Practical long-form guides for applicants searching for clear,
            strategy-led answers after a refusal.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {blogPosts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.05}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <article className="surface-card rounded-2xl p-6 transition hover:-translate-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                    {post.publishedAt} · {post.readTime}
                  </p>
                  <h2 className="mt-3 text-xl text-[var(--color-navy)] group-hover:text-[var(--color-gold)] transition">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {post.description}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-[var(--color-gold)]">
                    Read Article →
                  </p>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
