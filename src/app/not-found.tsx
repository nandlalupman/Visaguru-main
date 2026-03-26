import Link from "next/link";
import { Reveal } from "@/components/reveal";

export default function NotFound() {
  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-3xl px-4 text-center md:px-6">
        <Reveal variant="scale">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#fff7ea]">
            <span className="text-5xl">🔍</span>
          </div>
          <h1 className="text-5xl text-[var(--color-navy)] md:text-6xl">
            Page Not Found
          </h1>
          <p className="mt-4 text-sm text-[var(--color-muted)] md:text-base">
            The page you requested does not exist or may have moved. Here are
            some helpful links instead:
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="btn-shimmer inline-flex rounded-full bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)]"
            >
              Go to Homepage
            </Link>
            <Link
              href="/#free-analysis"
              className="inline-flex rounded-full border border-[var(--color-border)] px-6 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]"
            >
              Free Refusal Analysis
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { href: "/about", label: "About Us", icon: "👥" },
              { href: "/blog", label: "Blog & Guides", icon: "📝" },
              { href: "/reviews", label: "Client Reviews", icon: "⭐" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="surface-card flex items-center gap-3 rounded-2xl p-4 transition hover:border-[var(--color-gold)]/30"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="text-sm font-medium text-[var(--color-navy)]">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
