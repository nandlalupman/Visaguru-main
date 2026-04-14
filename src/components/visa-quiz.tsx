"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, GraduationCap, Briefcase, Plane, Check } from "lucide-react";

type Purpose = "study" | "work" | "tourist";
type Budget = "low" | "medium" | "high";
type Ielts = "yes" | "no" | "planning";

type Answers = {
  purpose?: Purpose;
  budget?: Budget;
  ielts?: Ielts;
  country?: string;
};

type Recommendation = {
  countries: string[];
  title: string;
  description: string;
  icon: string;
};

const countries = ["UK", "Canada", "Germany", "Australia", "Schengen", "Other"];

function getRecommendation(answers: Answers): Recommendation {
  const { purpose, budget, ielts } = answers;

  if (purpose === "study" && ielts === "yes") {
    return {
      countries: ["Canada", "UK"],
      title: "Canada & UK — Top Picks for You",
      description: "With IELTS and a study visa goal, Canada and the UK offer the strongest pathways. Both value strong SOPs and clear financial documentation.",
      icon: "🎓",
    };
  }

  if (purpose === "study" && ielts === "planning") {
    return {
      countries: ["Canada", "UK", "Germany"],
      title: "Prepare Your IELTS, Then Apply",
      description: "Great choice! Start IELTS prep now. Canada and UK need IELTS, but Germany has programs in English without it. We can help strategize your timeline.",
      icon: "📝",
    };
  }

  if (purpose === "study" && ielts === "no") {
    return {
      countries: ["Germany"],
      title: "Germany — No IELTS Required",
      description: "Germany offers tuition-free masters in English without IELTS at many universities. Low cost of living + strong post-study work options.",
      icon: "🇩🇪",
    };
  }

  if (budget === "low") {
    return {
      countries: ["Germany", "Schengen"],
      title: "Germany — Best Value Option",
      description: "With a lower budget, Germany is ideal — nearly tuition-free education, affordable living costs. Schengen tourist visas are also cost-effective.",
      icon: "💰",
    };
  }

  if (purpose === "tourist") {
    return {
      countries: ["Schengen", "UK"],
      title: "Schengen Visa — Explore Europe",
      description: "For tourism, a Schengen visa covers 27 European countries with one application. We can help ensure your SOP and financial docs pass first time.",
      icon: "✈️",
    };
  }

  if (purpose === "work") {
    return {
      countries: ["Canada", "UK", "Australia"],
      title: "Canada, UK & Australia — Work Visa Options",
      description: "All three countries have strong skilled worker programs. Your specific skills and experience will determine the best pathway.",
      icon: "💼",
    };
  }

  // Default
  return {
    countries: answers.country ? [answers.country] : ["Canada", "UK"],
    title: "Let Our Experts Analyze Your Case",
    description: "Based on your profile, our consultants can provide a personalized strategy for your visa application.",
    icon: "🌍",
  };
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export function VisaQuiz() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);

  const goNext = () => {
    if (step === 3) {
      setShowResult(true);
      return;
    }
    setDirection(1);
    setStep((p) => Math.min(p + 1, 3));
  };

  const goBack = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }
    setDirection(-1);
    setStep((p) => Math.max(p - 1, 0));
  };

  const selectOption = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    // Auto-advance after selection
    setTimeout(() => goNext(), 200);
  };

  const canProceed = () => {
    if (step === 0) return !!answers.purpose;
    if (step === 1) return !!answers.budget;
    if (step === 2) return !!answers.ielts;
    if (step === 3) return !!answers.country;
    return false;
  };

  const optionBtn = (selected: boolean) =>
    `flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-200 cursor-pointer ${
      selected
        ? "border-[var(--color-gold)] bg-[#fff9f0] text-[var(--color-navy)] shadow-sm"
        : "border-[var(--color-border)] bg-white text-[var(--color-navy)] hover:border-[var(--color-gold)]/50 hover:bg-[#fffdf8]"
    }`;

  if (showResult) {
    const rec = getRecommendation(answers);
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="surface-card rounded-3xl p-6 md:p-8"
      >
        <div className="text-center">
          <span className="text-5xl">{rec.icon}</span>
          <h3 className="mt-4 text-2xl text-[var(--color-navy)]">{rec.title}</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
            {rec.description}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {rec.countries.map((c) => (
              <span
                key={c}
                className="rounded-full bg-[var(--color-navy)] px-4 py-1.5 text-xs font-semibold text-white"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="#free-analysis"
              className="btn-shimmer inline-flex items-center justify-center rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-white transition hover:shadow-[var(--shadow-gold)]"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Get Full Analysis
            </a>
            <button
              type="button"
              onClick={() => { setShowResult(false); setStep(0); setAnswers({}); }}
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const stepLabels = ["Purpose", "Budget", "IELTS", "Country"];

  return (
    <div className="surface-card rounded-3xl p-6 md:p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          <span>Question {step + 1} of 4</span>
          <span>{stepLabels[step]}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="space-y-1">
              <div className="relative h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[var(--color-gold)]"
                  initial={false}
                  animate={{ width: i <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="relative min-h-[220px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-[var(--color-navy)]">
                  What is your visa purpose?
                </h3>
                <div className="grid gap-3">
                  <button type="button" className={optionBtn(answers.purpose === "study")} onClick={() => selectOption("purpose", "study")}>
                    <GraduationCap className="h-5 w-5 text-[var(--color-gold)]" />
                    <div><p className="font-semibold">Study</p><p className="text-xs text-[var(--color-muted)]">University, college, or language course</p></div>
                    {answers.purpose === "study" && <Check className="ml-auto h-4 w-4 text-[var(--color-gold)]" />}
                  </button>
                  <button type="button" className={optionBtn(answers.purpose === "work")} onClick={() => selectOption("purpose", "work")}>
                    <Briefcase className="h-5 w-5 text-[var(--color-gold)]" />
                    <div><p className="font-semibold">Work</p><p className="text-xs text-[var(--color-muted)]">Skilled worker, sponsorship, or transfer</p></div>
                    {answers.purpose === "work" && <Check className="ml-auto h-4 w-4 text-[var(--color-gold)]" />}
                  </button>
                  <button type="button" className={optionBtn(answers.purpose === "tourist")} onClick={() => selectOption("purpose", "tourist")}>
                    <Plane className="h-5 w-5 text-[var(--color-gold)]" />
                    <div><p className="font-semibold">Tourist</p><p className="text-xs text-[var(--color-muted)]">Short visit, travel, or family visit</p></div>
                    {answers.purpose === "tourist" && <Check className="ml-auto h-4 w-4 text-[var(--color-gold)]" />}
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-[var(--color-navy)]">
                  What is your approximate budget?
                </h3>
                <div className="grid gap-3">
                  {(["low", "medium", "high"] as const).map((b) => (
                    <button key={b} type="button" className={optionBtn(answers.budget === b)} onClick={() => selectOption("budget", b)}>
                      <span className="text-lg">{b === "low" ? "💰" : b === "medium" ? "💰💰" : "💰💰💰"}</span>
                      <div>
                        <p className="font-semibold capitalize">{b}</p>
                        <p className="text-xs text-[var(--color-muted)]">
                          {b === "low" ? "Under ₹5 lakh total" : b === "medium" ? "₹5–15 lakh total" : "₹15 lakh+ total"}
                        </p>
                      </div>
                      {answers.budget === b && <Check className="ml-auto h-4 w-4 text-[var(--color-gold)]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-[var(--color-navy)]">
                  Do you have IELTS / English proficiency?
                </h3>
                <div className="grid gap-3">
                  {([
                    { val: "yes" as const, label: "Yes, I have IELTS/TOEFL", desc: "Score ready for applications", icon: "✅" },
                    { val: "no" as const, label: "No", desc: "Haven't taken the test", icon: "❌" },
                    { val: "planning" as const, label: "Planning to take it", desc: "Preparing or booked", icon: "📅" },
                  ]).map((opt) => (
                    <button key={opt.val} type="button" className={optionBtn(answers.ielts === opt.val)} onClick={() => selectOption("ielts", opt.val)}>
                      <span className="text-lg">{opt.icon}</span>
                      <div><p className="font-semibold">{opt.label}</p><p className="text-xs text-[var(--color-muted)]">{opt.desc}</p></div>
                      {answers.ielts === opt.val && <Check className="ml-auto h-4 w-4 text-[var(--color-gold)]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-[var(--color-navy)]">
                  Preferred country?
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {countries.map((c) => (
                    <button key={c} type="button" className={optionBtn(answers.country === c)} onClick={() => selectOption("country", c)}>
                      <span className="text-lg">{c === "UK" ? "🇬🇧" : c === "Canada" ? "🇨🇦" : c === "Germany" ? "🇩🇪" : c === "Australia" ? "🇦🇺" : c === "Schengen" ? "🇪🇺" : "🌍"}</span>
                      <p className="font-semibold">{c}</p>
                      {answers.country === c && <Check className="ml-auto h-4 w-4 text-[var(--color-gold)]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex items-center rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed()}
          className="inline-flex items-center rounded-full bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {step === 3 ? "See Results" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
