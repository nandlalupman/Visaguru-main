import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Detailed refund policy for VisaGuru service plans.",
};

export default function RefundPolicyPage() {
  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
        <h1 className="text-4xl text-[var(--color-navy)] md:text-5xl">Refund Policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
          <p>
            Eligible full-recovery and express plans include a conditional refund
            promise. If a reapplication using documents prepared by VisaGuru is
            rejected again on the same visa category, clients may request a
            refund.
          </p>
          <p>
            Approved refunds are processed as total paid amount minus payment
            gateway charges (typically around 2%). Requests must be submitted
            within 15 days of receiving the refusal decision.
          </p>
          <p>
            Refund eligibility requires: complete and truthful client input,
            unchanged prepared documents during submission, and use of our
            provided checklist. Cases with external edits, missing documents, or
            changed visa objectives may be excluded.
          </p>
          <p>
            Analysis-only plans and completed custom writing delivered as agreed
            are non-refundable unless service delivery fails materially.
          </p>
          <p>
            For claims, email{" "}
            <a href="mailto:billing@visaguru.live" className="text-[var(--color-navy)]">
              billing@visaguru.live
            </a>{" "}
            with payment receipt, refusal letter, and submission evidence.
          </p>
        </div>
      </div>
    </section>
  );
}
