import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Star,
  Clock3,
  FileText,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getServices } from "@/lib/content-store";
import { getServiceSharedConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Our Services — Visa Refusal Recovery & SOP Writing | VisaGuru",
  description:
    "Explore VisaGuru's complete range of visa refusal recovery services. UK, Canada, Germany, Schengen, Australia visa recovery and fresh SOP writing.",
};

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "uk-visa": <Globe2 className="h-5 w-5" />,
  "canada-visa": <FileText className="h-5 w-5" />,
  "schengen-visa": <Globe2 className="h-5 w-5" />,
  "germany-visa": <FileText className="h-5 w-5" />,
  "australia-visa": <Globe2 className="h-5 w-5" />,
  "fresh-sop": <FileText className="h-5 w-5" />,
};

export default async function ServicesPage() {
  const [services, sharedConfig] = await Promise.all([
    getServices(),
    getServiceSharedConfig(),
  ]);

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="grain-bg section-padding border-b border-[var(--color-border)] bg-[linear-gradient(130deg,#1A2744_0%,#31456D_42%,#FAFAF8_100%)]">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <p className="inline-flex rounded-full border border-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              All Services
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl leading-tight text-white md:text-6xl">
              Every Visa Problem
              <br />
              Has a Strategy.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
              From refusal analysis to full SOP rebuilding — we offer tailored
              recovery services for 6 major visa categories. Each plan includes
              expert strategy, officer-focused documents, and a money-back
              guarantee.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#free-analysis"
                className="btn-shimmer inline-flex items-center justify-center rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-white"
              >
                Get Free Refusal Analysis{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                See Success Stories
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Trust bar ─── */}
      <section className="border-b border-[var(--color-border)] bg-white py-4">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-6 px-4 md:gap-12 md:px-6">
          {sharedConfig.trustStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-[var(--color-navy)]">
                {stat.value}
              </p>
              <p className="text-xs text-[var(--color-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── All Services Grid ─── */}
      <section className="section-padding section-gradient-warm">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-5xl">
              Choose Your Service
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--color-muted)]">
              Each service is tailored to the specific requirements and refusal
              patterns of its destination country.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((svc, idx) => (
              <Reveal key={svc.slug} delay={0.05 * idx}>
                <Link href={`/${svc.slug}`} className="group block h-full">
                  <article
                    className={`surface-card ${svc.accent} flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                  >
                    {/* Flag + icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{svc.flag}</span>
                      <span className="rounded-full bg-[var(--color-surface)] p-2 text-[var(--color-navy)]">
                        {SERVICE_ICONS[svc.slug]}
                      </span>
                    </div>

                    {/* Title + description */}
                    <h3 className="mt-4 text-xl font-semibold text-[var(--color-navy)]">
                      {svc.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                      {svc.description}
                    </p>

                    {/* Key differentiators (top 2) */}
                    {svc.differentiators.length > 0 && (
                      <ul className="mt-4 space-y-1.5">
                        {svc.differentiators.slice(0, 2).map((d) => (
                          <li
                            key={d}
                            className="flex gap-2 text-xs text-[var(--color-muted)]"
                          >
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Price + CTA */}
                    <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                      <p className="font-mono text-sm font-semibold text-[var(--color-navy)]">
                        {svc.price}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-gold)] transition group-hover:gap-2">
                        Learn More{" "}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-shimmer-divider" />

      {/* ─── How It Works ─── */}
      <section className="section-padding section-gradient-navy">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--color-muted)]">
              A proven 4-step process that turns refusals into approvals.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {sharedConfig.processSteps.map((step, i) => (
              <Reveal key={step.title} delay={0.08 * i}>
                <article className="surface-card rounded-2xl p-5 text-center">
                  <span className="step-number mx-auto">{i + 1}</span>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-gold)]">
                    {step.day}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--color-navy)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {step.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-shimmer-divider" />

      {/* ─── Pricing Comparison ─── */}
      <section className="section-padding">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-5xl">
              Pricing Across Services
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--color-muted)]">
              Transparent fees. No hidden charges. Choose any service and plan
              level.
            </p>
          </Reveal>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--color-border)]">
                  <th className="px-4 py-3 text-left font-semibold text-[var(--color-navy)]">
                    Service
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[var(--color-muted)]">
                    Analysis
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[var(--color-gold)]">
                    Full Recovery ★
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[var(--color-muted)]">
                    Express
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc) => (
                  <tr
                    key={svc.slug}
                    className="border-b border-[var(--color-border)] transition hover:bg-[var(--color-surface)]"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/${svc.slug}`}
                        className="flex items-center gap-2 font-semibold text-[var(--color-navy)] hover:text-[var(--color-gold)] transition"
                      >
                        <span className="text-lg">{svc.flag}</span>
                        {svc.title}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-[var(--color-muted)]">
                      {svc.pricing.analysis}
                    </td>
                    <td className="px-4 py-4 text-center font-mono font-semibold text-[var(--color-navy)]">
                      {svc.pricing.fullRecovery}
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-[var(--color-muted)]">
                      {svc.pricing.express}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--color-muted)]">
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[var(--color-green)]" />
              Secure payment via Razorpay
            </p>
            <p className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-[var(--color-gold)]" />
              Refund available on eligible rejections
            </p>
            <p className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-[var(--color-gold)]" />
              48-hour delivery on standard plans
            </p>
          </div>
        </div>
      </section>

      <div className="gold-shimmer-divider" />

      {/* ─── CTA Section ─── */}
      <section className="section-padding section-gradient-gold">
        <div className="mx-auto w-full max-w-3xl px-4 text-center md:px-6">
          <Reveal>
            <h2 className="text-3xl text-[var(--color-navy)] md:text-5xl">
              Not Sure Which Service You Need?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
              Share your refusal letter and get a free expert analysis within 2
              hours. We&apos;ll recommend the right plan based on your specific
              case, country, and visa type — no commitment required.
            </p>
            <Link
              href="/#free-analysis"
              className="btn-shimmer mt-8 inline-flex items-center rounded-full bg-[var(--color-gold)] px-8 py-3.5 text-sm font-semibold text-white"
            >
              Get Free Refusal Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
