import { Metadata } from "next";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About VisaGuru",
  description:
    "Meet the VisaGuru team, founder story, mission, and company credentials.",
};

const teamMembers = [
  {
    name: "Priya Mehta",
    role: "Founder & Lead Refusal Strategist",
    bio: "Former UK documentation reviewer with 9 years in case diagnostics and SOP recovery.",
    linkedin: "https://www.linkedin.com",
  },
  {
    name: "Rajat Narang",
    role: "Senior SOP Writer",
    bio: "Specializes in study permit SOPs and progression narratives for UK, Canada, and Germany.",
    linkedin: "https://www.linkedin.com",
  },
  {
    name: "Naina Kapoor",
    role: "Financial Documentation Specialist",
    bio: "Builds sponsor and fund-source explanation frameworks for refusal recovery.",
    linkedin: "https://www.linkedin.com",
  },
];

const timeline = [
  { year: "2020", event: "Founded after the founder's own refusal-recovery journey." },
  { year: "2021", event: "First 100 successful refusal-recovery cases completed." },
  { year: "2023", event: "Expanded to UK, Canada, Schengen, Germany, and Australia." },
  { year: "2026", event: "500+ cases handled with a 94% strategy-led success benchmark." },
];

export default function AboutPage() {
  return (
    <>
      <section className="section-padding border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <p className="inline-flex rounded-full bg-[#fff7ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
              About VisaGuru
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl text-[var(--color-navy)] md:text-6xl">
              Built by people who know what rejection feels like
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
              VisaGuru started after a personal refusal experience revealed how
              most applicants are failed by generic writing and weak strategy.
              We built a service that focuses on precision: refusal-line
              diagnosis, credible SOP architecture, and evidence-backed
              reapplication.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="team" className="section-padding">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-3xl text-[var(--color-navy)] md:text-5xl">Our Team</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {teamMembers.map((member, index) => (
              <Reveal key={member.name} delay={0.06 * index}>
                <article className="surface-card rounded-2xl p-5">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-navy)] text-lg font-semibold text-white">
                    {member.name
                      .split(" ")
                      .map((item) => item[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <h3 className="text-xl text-[var(--color-navy)]">{member.name}</h3>
                  <p className="text-sm text-[var(--color-gold)]">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                    {member.bio}
                  </p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--color-navy)]"
                  >
                    LinkedIn →
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-rule" />

      <section className="section-padding bg-[var(--color-surface)]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-6">
          <Reveal>
            <h2 className="text-3xl text-[var(--color-navy)] md:text-5xl">Growth Timeline</h2>
            <div className="mt-6 space-y-4">
              {timeline.map((item) => (
                <div key={item.year} className="surface-card rounded-2xl p-4">
                  <p className="font-mono text-sm font-semibold text-[var(--color-gold)]">
                    {item.year}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{item.event}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl text-[var(--color-navy)] md:text-5xl">Mission & Trust</h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--color-muted)]">
              <p className="surface-card rounded-2xl p-4">
                Our mission is to replace template-based visa writing with
                strategy-led documentation that officers can evaluate clearly.
              </p>
              <p className="surface-card rounded-2xl p-4">
                Registered Entity: VisaGuru Documentation Services Private
                Limited, CIN U12345MH2020PTC123456, Maharashtra, India.
              </p>
              <p className="surface-card rounded-2xl p-4">
                Compliance: GDPR and DPDP aligned data handling, encrypted file
                transfer, and defined retention policy.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
