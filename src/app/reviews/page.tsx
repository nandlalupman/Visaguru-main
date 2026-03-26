import { Metadata } from "next";
import { Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getTestimonials, getVideoTestimonials } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "Client Reviews & Success Stories",
  description:
    "Read client reviews and country-wise success stories for visa refusal recovery cases.",
};

const countryStats = [
  { label: "UK", value: "91%", flag: "🇬🇧" },
  { label: "Canada", value: "95%", flag: "🇨🇦" },
  { label: "Germany", value: "93%", flag: "🇩🇪" },
  { label: "Schengen", value: "92%", flag: "🇪🇺" },
  { label: "Australia", value: "94%", flag: "🇦🇺" },
];

export default async function ReviewsPage() {
  const [testimonials, videos] = await Promise.all([
    getTestimonials(),
    getVideoTestimonials(),
  ]);

  return (
    <>
      <section className="section-padding hero-gradient grain-bg relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="hero-float-1" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h1 className="text-4xl text-white md:text-6xl">
              Real Client Reviews
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
              Transparent feedback, case context, and approval benchmarks by
              country and visa type.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {countryStats.map((item) => (
              <article key={item.label} className="glass-card rounded-2xl p-4">
                <p className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-semibold text-white">
                    {item.value}
                  </span>
                  <span className="text-lg">{item.flag}</span>
                </p>
                <p className="text-xs text-white/70">{item.label} approvals</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item, index) => {
              const initials = item.name.split(" ").map((w) => w[0]).join("");
              return (
                <Reveal key={item.name} delay={index * 0.04}>
                  <article className="surface-card rounded-2xl p-5">
                    <div className="mb-3 flex items-center gap-1 text-[var(--color-gold)]">
                      {[...Array(item.rating)].map((_, idx) => (
                        <Star key={`${item.name}-${idx}`} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                      &quot;{item.feedback}&quot;
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className={`avatar-initial avatar-${index % 6}`}>
                        {initials}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-navy)]">
                          {item.name}
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">
                          {item.country} · {item.date}
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

      <section className="section-padding section-gradient-warm">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-3xl text-[var(--color-navy)] md:text-5xl">
              Video Testimonials
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[var(--color-muted)]">
              Watch our clients share their visa recovery journeys.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {videos.map((item) => (
              <article
                key={item.id}
                className="video-card surface-card aspect-video cursor-pointer rounded-2xl"
              >
                <div className="absolute bottom-4 left-4 z-10">
                  <p className="text-sm font-semibold text-[var(--color-navy)]">
                    {item.title}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">{item.country}</p>
                </div>
              </article>
            ))}
          </div>
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noreferrer"
            className="btn-shimmer mt-8 inline-flex rounded-full bg-[var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-white transition hover:shadow-[var(--shadow-md)]"
          >
            Open Google Reviews Profile →
          </a>
        </div>
      </section>
    </>
  );
}
