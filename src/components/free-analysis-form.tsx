"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Upload } from "lucide-react";

const visaTypes = ["UK", "Canada", "Europe", "Germany", "Australia", "Other"] as const;

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Enter a valid email address."),
  whatsapp: z
    .string()
    .min(8, "Enter a valid WhatsApp number.")
    .regex(/^[\d+\-\s()]+$/, "Use numbers and + - ( ) only."),
  visaType: z.enum(visaTypes, { message: "Select a visa type." }),
  message: z.string().max(500, "Message must be under 500 characters.").optional(),
});

type FormValues = z.infer<typeof schema>;
type FormWithFile = FormValues & { refusalLetter?: FileList };

const steps = ["Your Details", "Visa Context", "Upload & Submit"];

type SessionResponse = {
  authenticated?: boolean;
  user?: {
    email?: string;
  };
};

type ApiResult = {
  message?: string;
  loginUrl?: string;
};

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

export function FreeAnalysisForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [dragActive, setDragActive] = useState(false);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "guest">(
    "loading",
  );
  const [accountEmail, setAccountEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await response.json()) as SessionResponse;
        if (!cancelled) {
          setAuthState(data.authenticated ? "authenticated" : "guest");
          setAccountEmail(data.user?.email ?? null);
        }
      } catch {
        if (!cancelled) setAuthState("guest");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm<FormWithFile>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      whatsapp: "",
      visaType: "UK",
      message: "",
    },
  });

  const goNext = async () => {
    if (step === 0) {
      const ok = await trigger(["fullName", "email", "whatsapp"]);
      if (!ok) return;
    }
    if (step === 1) {
      const ok = await trigger(["visaType"]);
      if (!ok) return;
    }
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (values: FormWithFile) => {
    startTransition(async () => {
      const data = new FormData();
      data.append("fullName", values.fullName);
      data.append("email", values.email);
      data.append("whatsapp", values.whatsapp);
      data.append("visaType", values.visaType);
      data.append("message", values.message || "");
      const file = values.refusalLetter?.[0];
      if (file) {
        data.append("refusalLetter", file);
      }

      const response = await fetch("/api/free-analysis", {
        method: "POST",
        body: data,
      });
      const result = (await response.json()) as ApiResult;

      if (response.status === 401) {
        window.location.assign(result.loginUrl ?? "/login?next=/#free-analysis");
        return;
      }

      setServerMessage(
        result.message ||
          (response.ok
            ? "Request submitted. We will share your refusal strategy within 2 hours."
            : "Unable to submit request. Please try again."),
      );
      if (response.ok) {
        setSuccess(true);
        reset();
        setStep(0);
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
        <button
          type="button"
          className="mt-6 rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]"
          onClick={() => { setSuccess(false); setServerMessage(null); }}
        >
          Submit Another Request
        </button>
      </motion.div>
    );
  }

  if (authState === "loading") {
    return (
      <div className="surface-card rounded-3xl p-8 text-center">
        <p className="text-sm text-[var(--color-muted)]">Checking your account...</p>
      </div>
    );
  }

  if (authState === "guest") {
    const nextPath = encodeURIComponent("/#free-analysis");
    return (
      <div className="surface-card rounded-3xl p-8 text-center">
        <h3 className="text-2xl text-[var(--color-navy)]">Login Required</h3>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Create an account or log in to submit your refusal letter and track your case progress.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={`/login?next=${nextPath}`}
            className="rounded-full bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)]"
          >
            Login
          </a>
          <a
            href={`/signup?next=${nextPath}`}
            className="rounded-full border border-[var(--color-border)] px-6 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]"
          >
            Create Account
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="surface-card rounded-3xl p-6 md:p-8"
      style={{ transform: "none" }}
    >
      {/* Progress Header */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          <span>Step {step + 1} of 3</span>
          <span>{steps[step]}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {steps.map((item, index) => (
            <div key={item} className="space-y-1.5">
              <div className="relative h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[var(--color-gold)]"
                  initial={false}
                  animate={{ width: index <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <p
                className={`text-[11px] transition-colors ${
                  index <= step ? "text-[var(--color-navy)] font-medium" : "text-[var(--color-muted)]"
                }`}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Logged in as {accountEmail ?? "your account"}. This submission will appear in your dashboard timeline.
        </p>
      </div>

      {/* Step Content */}
      <div className="relative min-h-[200px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {step === 0 && (
              <div className="grid gap-4">
                <label className="text-sm font-medium text-[var(--color-navy)]">
                  Full Name
                  <input type="text" {...register("fullName")} className={inputClass} placeholder="Enter your full name" />
                  {errors.fullName && (
                    <span className="mt-1 block text-xs text-[var(--color-red)]">{errors.fullName.message}</span>
                  )}
                </label>

                <label className="text-sm font-medium text-[var(--color-navy)]">
                  Email
                  <input type="email" {...register("email")} className={inputClass} placeholder="you@example.com" />
                  {errors.email && (
                    <span className="mt-1 block text-xs text-[var(--color-red)]">{errors.email.message}</span>
                  )}
                </label>

                <label className="text-sm font-medium text-[var(--color-navy)]">
                  WhatsApp Number
                  <input type="tel" {...register("whatsapp")} className={inputClass} placeholder="+91 98XXXXXXXX" />
                  {errors.whatsapp && (
                    <span className="mt-1 block text-xs text-[var(--color-red)]">{errors.whatsapp.message}</span>
                  )}
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4">
                <label className="text-sm font-medium text-[var(--color-navy)]">
                  Visa Type
                  <select {...register("visaType")} className={inputClass}>
                    {visaTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.visaType && (
                    <span className="mt-1 block text-xs text-[var(--color-red)]">{errors.visaType.message}</span>
                  )}
                </label>

                <label className="text-sm font-medium text-[var(--color-navy)]">
                  Message (optional)
                  <textarea
                    rows={5}
                    {...register("message")}
                    className={inputClass}
                    placeholder="Tell us your refusal reason, target intake, and timeline."
                  />
                  {errors.message && (
                    <span className="mt-1 block text-xs text-[var(--color-red)]">{errors.message.message}</span>
                  )}
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4">
                {/* Drag and Drop Zone */}
                <label
                  className={`text-sm font-medium text-[var(--color-navy)] ${dragActive ? "" : ""}`}
                >
                  Upload Refusal Letter (PDF, optional)
                  <div
                    className={`mt-1.5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                      dragActive
                        ? "border-[var(--color-gold)] bg-[#fff7ea]"
                        : "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-gold)]/50"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={() => setDragActive(false)}
                  >
                    <Upload className="mb-2 h-8 w-8 text-[var(--color-muted)]" />
                    <p className="text-sm text-[var(--color-muted)]">Drag & drop your PDF here, or</p>
                    <input
                      type="file"
                      accept="application/pdf"
                      {...register("refusalLetter")}
                      className="mt-2 text-sm text-[var(--color-muted)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--color-navy)] file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-white file:cursor-pointer"
                    />
                  </div>
                </label>

                <p className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-xs text-[var(--color-muted)]">
                  🔒 256-bit encrypted upload | Your documents are never shared | GDPR
                  and DPDP aligned
                </p>

                {serverMessage && !success && (
                  <p className="text-sm font-medium text-[var(--color-red)]">
                    {serverMessage}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          disabled={step === 0}
          onClick={goBack}
          className="rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>

        {step < 2 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)]"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="btn-shimmer inline-flex items-center justify-center rounded-full bg-[var(--color-gold)] px-6 py-2.5 text-sm font-semibold text-white transition hover:shadow-[var(--shadow-gold)] disabled:opacity-70"
          >
            {isPending ? "Submitting..." : "Get Free Analysis →"}
          </button>
        )}
      </div>
    </form>
  );
}
