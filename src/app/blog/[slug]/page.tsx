import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/content-store";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return {
      title: "Article Not Found",
    };
  }
  return {
    title: post.title,
    description: post.description,
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="section-padding">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          {post.publishedAt} · {post.readTime}
        </p>
        <h1 className="mt-4 text-4xl leading-tight text-[var(--color-navy)] md:text-6xl">
          {post.title}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-[var(--color-muted)]">
          {post.description}
        </p>

        <div className="mt-10 space-y-10">
          {post.content.map((section) => (
            <section key={section.heading}>
              <h2 className="text-3xl text-[var(--color-navy)]">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.heading}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <p className="text-sm font-semibold text-[var(--color-navy)]">{post.cta}</p>
          <Link
            href="/#free-analysis"
            className="mt-4 inline-flex rounded-full bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Get Free Refusal Analysis
          </Link>
        </div>
      </div>
    </article>
  );
}
