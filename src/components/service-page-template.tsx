import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock3,
} from "lucide-react";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import type { CmsService } from "@/lib/content-store";

type ServiceTemplateProps = {
  service: CmsService;
  otherServices: { slug: string; flag: string; title: string; price: string; accent: string }[];
  processSteps: { title: string; day: string; description: string }[];
  trustStats: { value: string; label: string }[];
};

export function ServicePageTemplate({
  service,
  otherServices,
  processSteps,
  trustStats,
}: ServiceTemplateProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    provider: {
      "@type": "LocalBusiness",
      name: "VisaGuru",
      areaServed: "India",
      url: "https://visaguru.live",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: service.pricing.fullRecovery.replace(/[^\d]/g, ""),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* ─── Hero ─── */}
      <section className="grain-bg section-padding border-b border-[var(--color-border)] bg-[linear-gradient(130deg,#1A2744_0%,#31456D_42%,#FAFAF8_100%)]">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <p className="inline-flex rounded-full border border-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              {service.flag} Country-Specific Strategy
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl leading-tight text-white md:text-6xl">
              {service.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base text-white/85 md:text-lg">
              {service.subtitle}
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
                See Approval Stories
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Trust Stats Bar ─── */}
      <section className="border-b border-[var(--color-border)] bg-white py-4">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-6 px-4 md:gap-12 md:px-6">
          {trustStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-[var(--color-navy)]">
                {stat.value}
              </p>
              <p className="text-xs text-[var(--color-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Why This Visa Gets Refused + What We Do ─── */}
      <section className="section-padding section-gradient-warm">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-6">
          <Reveal>
            <h2 className="text-3xl text-[var(--color-navy)] md:text-4xl">
              Why this visa type gets refused
            </h2>
            <div className="mt-6 space-y-3">
              {service.reasonStats.map((item, idx) => (
                <div
                  key={item}
                  className="surface-card flex gap-4 rounded-2xl p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl text-[var(--color-navy)] md:text-4xl">
              What we do differently
            </h2>
            <div className="mt-6 space-y-3">
              {service.differentiators.map((item) => (
                <div
                  key={item}
                  className="surface-card flex gap-3 rounded-2xl p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-green)]" />
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="gold-shimmer-divider" />

      {/* ─── Our Process ─── */}
      <section className="section-padding section-gradient-navy">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-4xl">
              How We Recover Your Visa
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--color-muted)]">
              A proven 4-step process specifically calibrated for{" "}
              {service.flag} cases.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={0.08 * i}>
                <article className="surface-card rounded-2xl p-5 text-center">
                  <span className="step-number mx-auto">{i + 1}</span>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-gold)]">
                    {step.day}
                  </p>
                  <h3 className="mt-3 font-semibold text-[var(--color-navy)]">
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

      {/* ─── Testimonials ─── */}
      <section className="section-padding">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-3xl text-[var(--color-navy)] md:text-4xl">
              {service.flag} Client Success Stories
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Real outcomes from applicants who recovered with our strategy.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {service.testimonials.map((item, index) => {
              const initials = item.name
                .split(" ")
                .map((w) => w[0])
                .join("");
              return (
                <Reveal key={item.name} delay={0.05 * index}>
                  <article className="surface-card rounded-2xl p-5">
                    <div className="flex gap-1 text-[var(--color-gold)]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-current"
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                      &quot;{item.feedback}&quot;
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <span
                        className={`avatar-initial avatar-${index % 6}`}
                      >
                        {initials}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-navy)]">
                          {item.name}
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="gold-shimmer-divider" />

      {/* ─── Pricing ─── */}
      <section className="section-padding section-gradient-gold">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-3xl text-[var(--color-navy)] md:text-4xl">
              Service Pricing
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Transparent fees with secure UPI / QR payment. Pick the plan
              that fits your case.
            </p>
          </Reveal>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <Reveal>
              <article className="surface-card rounded-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Analysis
                </p>
                <p className="mt-2 font-mono text-3xl font-semibold text-[var(--color-navy)]">
                  {service.pricing.analysis}
                </p>
                <ul className="mt-4 space-y-2 text-xs text-[var(--color-muted)]">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                    Detailed refusal analysis
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                    Written strategy report
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                    Reapplication checklist
                  </li>
                </ul>
                <Link
                  href="/#free-analysis"
                  className="mt-5 block w-full rounded-full border border-[var(--color-border)] py-2.5 text-center text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]"
                >
                  Get Started →
                </Link>
              </article>
            </Reveal>
            <Reveal delay={0.05}>
              <article className="surface-card popular-ribbon rounded-2xl border-[var(--color-gold)] p-6 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-gold)]">
                  Full Recovery — Most Popular
                </p>
                <p className="mt-2 font-mono text-3xl font-semibold text-[var(--color-navy)]">
                  {service.pricing.fullRecovery}
                </p>
                <ul className="mt-4 space-y-2 text-xs text-[var(--color-muted)]">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                    Everything in Analysis
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                    Full SOP rewrite (2 revisions)
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                    Financial explanation letter
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                    48-hour delivery
                  </li>
                </ul>
                <Link
                  href="/#free-analysis"
                  className="btn-shimmer mt-5 block w-full rounded-full bg-[var(--color-gold)] py-2.5 text-center text-sm font-semibold text-white hover:shadow-[var(--shadow-gold)]"
                >
                  Get Started →
                </Link>
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="surface-card rounded-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Express
                </p>
                <p className="mt-2 font-mono text-3xl font-semibold text-[var(--color-navy)]">
                  {service.pricing.express}
                </p>
                <ul className="mt-4 space-y-2 text-xs text-[var(--color-muted)]">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                    Everything in Full Recovery
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                    24-hour priority delivery
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                    Priority WhatsApp support
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                    Cover letter included
                  </li>
                </ul>
                <Link
                  href="/#free-analysis"
                  className="mt-5 block w-full rounded-full border border-[var(--color-border)] py-2.5 text-center text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]"
                >
                  Get Started →
                </Link>
              </article>
            </Reveal>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--color-muted)]">
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[var(--color-green)]" />
              Secure payment via UPI / QR Code
            </p>
            <p className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-[var(--color-gold)]" />
              Work starts within 2 hours of payment
            </p>
          </div>
        </div>
      </section>

      <div className="gold-shimmer-divider" />

      {/* ─── FAQ ─── */}
      <section className="section-padding">
        <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-[var(--color-muted)]">
              Common questions about {service.flag} visa recovery.
            </p>
          </Reveal>
          <div className="mt-8">
            <FaqAccordion items={service.faq} />
          </div>
        </div>
      </section>

      <div className="gold-shimmer-divider" />

      {/* ─── Cross-sell: Other Services ─── */}
      <section className="section-padding section-gradient-navy">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-4xl">
              Explore Other Services
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-[var(--color-muted)]">
              We offer country-specific recovery for all major visa types.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {otherServices.map((svc, idx) => (
              <Reveal key={svc.slug} delay={0.05 * idx}>
                <Link href={`/${svc.slug}`} className="group block">
                  <article
                    className={`surface-card ${svc.accent} rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-md`}
                  >
                    <span className="text-2xl">{svc.flag}</span>
                    <h3 className="mt-2 text-sm font-semibold text-[var(--color-navy)]">
                      {svc.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-[var(--color-muted)]">
                      {svc.price}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-gold)] transition group-hover:gap-1.5">
                      View <ArrowRight className="h-3 w-3" />
                    </span>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
