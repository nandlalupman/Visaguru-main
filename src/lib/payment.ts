export const PAYMENT_PLANS = {
  "Refusal Analysis Only": { amountInInr: 999, currency: "INR" },
  "Full Visa Recovery": { amountInInr: 4999, currency: "INR" },
  "Express Recovery": { amountInInr: 7999, currency: "INR" },
} as const;

export type PaymentPlanName = keyof typeof PAYMENT_PLANS;

export function isPaymentPlanName(value: string): value is PaymentPlanName {
  return Object.prototype.hasOwnProperty.call(PAYMENT_PLANS, value);
}
