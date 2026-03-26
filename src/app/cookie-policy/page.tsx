import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie usage policy for VisaGuru website visitors.",
};

export default function CookiePolicyPage() {
  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
        <h1 className="text-4xl text-[var(--color-navy)] md:text-5xl">Cookie Policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
          <p>
            VisaGuru uses essential cookies for session security and basic site
            functionality. We may also use privacy-safe analytics cookies to
            understand traffic and improve performance.
          </p>
          <p>
            You can control non-essential cookie preferences using our cookie
            banner and browser settings. Blocking essential cookies may affect
            form and navigation behavior.
          </p>
          <p>
            We do not use third-party advertising trackers for behavioral
            profiling. Cookie records are retained for operational purposes only
            and reviewed periodically.
          </p>
        </div>
      </div>
    </section>
  );
}
