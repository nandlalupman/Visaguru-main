import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How VisaGuru handles personal data and document security.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
        <h1 className="text-4xl text-[var(--color-navy)] md:text-5xl">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
          <p>
            VisaGuru collects only the information required to evaluate and
            deliver refusal-recovery services, including contact details,
            refusal letters, and related supporting documents.
          </p>
          <p>
            Documents are encrypted in transit and stored with strict access
            controls. Unless legally required, case documents are deleted within
            30 days after service completion.
          </p>
          <p>
            We do not sell personal data. Limited third-party processors (such
            as payment gateways and email providers) are used only to deliver
            contracted services.
          </p>
          <p>
            You may request data access, correction, or deletion by emailing{" "}
            <a href="mailto:privacy@visaguru.live" className="text-[var(--color-navy)]">
              privacy@visaguru.live
            </a>
            . This policy is intended to align with GDPR and India DPDP
            obligations.
          </p>
        </div>
      </div>
    </section>
  );
}
