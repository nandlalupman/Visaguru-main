import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Service terms for VisaGuru refusal-recovery and SOP writing.",
};

export default function TermsPage() {
  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
        <h1 className="text-4xl text-[var(--color-navy)] md:text-5xl">Terms of Service</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
          <p>
            VisaGuru provides document preparation and SOP writing services.
            We are not a law firm and do not provide legal advice.
          </p>
          <p>
            Approval is not guaranteed because final decisions are made solely by
            immigration authorities. Our service includes strategy, document
            drafting, and revision as per selected plan scope.
          </p>
          <p>
            Clients must provide truthful and complete information. VisaGuru is
            not responsible for outcomes affected by incorrect data, withheld
            documents, or post-delivery edits made by third parties.
          </p>
          <p>
            Delivery timelines begin after full case intake. Urgent timelines
            require express plan confirmation. Payment disputes are governed by
            applicable Indian law and platform payment terms.
          </p>
        </div>
      </div>
    </section>
  );
}
