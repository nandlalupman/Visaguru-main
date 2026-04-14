"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Calendar } from "lucide-react";

export const visaTypes = ["UK", "Canada", "Europe", "Germany", "Australia", "Other"] as const;

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  whatsapp: z
    .string()
    .optional()
    .refine((val) => !val || /^[\d+\-\s()]+$/.test(val), {
      message: "Use numbers and + - ( ) only.",
    }),
  visaType: z.enum(visaTypes, { message: "Select a visa type." }),
  message: z.string().max(500, "Message must be under 500 characters.").optional(),
});

type FormValues = z.infer<typeof schema>;

type ApiResult = {
  message?: string;
  loginUrl?: string; // Kept for safety, though API no longer returns 401
};

export function FreeAnalysisForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      whatsapp: "",
      visaType: "UK",
      message: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const data = new FormData();
      data.append("email", values.email);
      data.append("whatsapp", values.whatsapp || "");
      data.append("visaType", values.visaType);
      data.append("message", values.message || "");

      try {
        const response = await fetch("/api/free-analysis", {
          method: "POST",
          body: data,
        });
        const result = (await response.json()) as ApiResult;

        if (response.status === 401 && result.loginUrl) {
           window.location.assign(result.loginUrl);
           return;
        }

        setServerMessage(
          result.message ||
            (response.ok
              ? "Request submitted. We will share your refusal strategy within 2 hours."
              : "Unable to submit request. Please try again.")
        );

        if (response.ok) {
          setSuccess(true);
          reset();
        }
      } catch (error) {
        setServerMessage("Unable to submit request. Please try again.");
      }
    });
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20";

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="surface-card flex flex-col items-center rounded-3xl p-8 text-center"
        style={{ transform: "none" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        >
          <CheckCircle2 className="h-16 w-16 text-[var(--color-green)]" />
        </motion.div>
        <h3 className="mt-4 text-2xl text-[var(--color-navy)]">Analysis Request Submitted!</h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{serverMessage}</p>
        
        <div className="mt-6 flex flex-col gap-3 sm:flex-row w-full justify-center">
          <a
            href="https://wa.me/917737099474?text=Hi%20VisaGuru,%20I%20just%20submitted%20a%20free%20analysis%20request."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat on WhatsApp
          </a>
          <a
            href="/services"
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)]"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book Consultation
          </a>
        </div>

        <button
          type="button"
          className="mt-6 text-xs text-[var(--color-muted)] underline transition hover:text-[var(--color-navy)]"
          onClick={() => { setSuccess(false); setServerMessage(null); }}
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="surface-card flex flex-col gap-5 rounded-3xl p-6 md:p-8"
      style={{ transform: "none" }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-[var(--color-navy)] sm:col-span-2">
          Email Address <span className="text-[var(--color-red)]">*</span>
          <input type="email" {...register("email")} className={inputClass} placeholder="you@example.com" />
          {errors.email && (
            <span className="mt-1 block text-xs text-[var(--color-red)]">{errors.email.message}</span>
          )}
        </label>

        <label className="text-sm font-medium text-[var(--color-navy)]">
          Phone / WhatsApp <span className="text-[var(--color-muted)] font-normal">(Optional)</span>
          <input type="tel" {...register("whatsapp")} className={inputClass} placeholder="+91 98XXXXXXXX" />
          {errors.whatsapp && (
            <span className="mt-1 block text-xs text-[var(--color-red)]">{errors.whatsapp.message}</span>
          )}
        </label>

        <label className="text-sm font-medium text-[var(--color-navy)]">
          Visa Type <span className="text-[var(--color-red)]">*</span>
          <select {...register("visaType")} className={inputClass}>
            {visaTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.visaType && (
            <span className="mt-1 block text-xs text-[var(--color-red)]">{errors.visaType.message}</span>
          )}
        </label>

        <label className="text-sm font-medium text-[var(--color-navy)] sm:col-span-2">
          Message <span className="text-[var(--color-muted)] font-normal">(Optional)</span>
          <textarea
            rows={3}
            {...register("message")}
            className={inputClass}
            placeholder="Briefly describe your refusal reason..."
          />
          {errors.message && (
            <span className="mt-1 block text-xs text-[var(--color-red)]">{errors.message.message}</span>
          )}
        </label>
      </div>

      {serverMessage && !success && (
        <p className="text-sm font-medium text-[var(--color-red)]">
          {serverMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-shimmer mt-2 inline-flex items-center justify-center rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-white transition hover:shadow-[var(--shadow-gold)] disabled:opacity-70"
      >
        {isPending ? "Submitting..." : "Get Free Analysis →"}
      </button>

      <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
        Your email is securely stored and never shared. We follow strict GDPR and DPDP data policies.
      </p>
    </form>
  );
}
