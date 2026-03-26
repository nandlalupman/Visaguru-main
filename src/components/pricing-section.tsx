"use client";

import { CheckCircle2, ShieldCheck, Clock3 } from "lucide-react";
import Link from "next/link";
import { RazorpayButton } from "@/components/razorpay-button";
import { Reveal } from "@/components/reveal";

type PricingTier = {
  id: string;
  name: string;
  price: string;
  note: string;
  features: string[];
  popular: boolean;
  amountInr: number;
};

export function PricingSection({ tiers }: { tiers: PricingTier[] }) {
  return (
    <>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {tiers.map((tier) => (
          <Reveal key={tier.name}>
            <article
              className={`surface-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                tier.popular ? "popular-ribbon shadow-lg" : ""
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                {tier.note}
              </p>
              <h3 className="mt-2 text-2xl text-[var(--color-navy)]">{tier.name}</h3>
              <p className="mt-3 font-mono text-3xl font-semibold text-[var(--color-navy)]">
                {tier.price}
              </p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2 text-sm text-[var(--color-muted)]"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-green)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <RazorpayButton
                planName={tier.name}
                className={`mt-5 block w-full rounded-full py-2.5 text-center text-sm font-semibold transition ${
                  tier.popular
                    ? "btn-shimmer bg-[var(--color-gold)] text-white hover:shadow-[var(--shadow-gold)]"
                    : "border border-[var(--color-border)] text-[var(--color-navy)] hover:bg-[var(--color-bg)]"
                }`}
              >
                Get Started -&gt;
              </RazorpayButton>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-3 text-xs text-[var(--color-muted)] md:grid-cols-3">
        <p className="surface-card rounded-2xl p-4">
          Refund Policy: If your visa is rejected a second time with our prepared
          documents, we offer a full refund minus gateway charges (~2%).{" "}
          <Link href="/refund-policy">Read full policy -&gt;</Link>
        </p>
        <p className="surface-card rounded-2xl p-4">
          <ShieldCheck className="mb-2 h-4 w-4 text-[var(--color-green)]" />
          100% secure payment with SSL via Razorpay.
        </p>
        <p className="surface-card rounded-2xl p-4">
          <Clock3 className="mb-2 h-4 w-4 text-[var(--color-gold)]" />
          Work starts within 2 hours of receiving payment and documents.
        </p>
      </div>
    </>
  );
}
