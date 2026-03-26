"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AuthForm({
  mode,
  nextPath,
}: {
  mode: "login" | "signup";
  nextPath?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20";

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const endpoint =
            mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                mode === "signup"
                ? { name: name.trim(), email: email.trim(), password, nextPath }
                : { email: email.trim(), password, nextPath },
            ),
          });
          const result = (await response.json()) as {
            redirect?: string;
            message?: string;
          };
          if (!response.ok) {
            setError(result.message ?? "Something went wrong.");
            return;
          }
          if (result.redirect) {
            router.push(result.redirect);
          } else {
            router.push("/dashboard");
          }
          router.refresh();
        });
      }}
    >
      {mode === "signup" && (
        <label className="block text-sm font-medium text-[var(--color-navy)]">
          Full Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className={inputClass}
            placeholder="Your full name"
          />
        </label>
      )}

      <label className="block text-sm font-medium text-[var(--color-navy)]">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className={inputClass}
          placeholder="you@example.com"
        />
      </label>

      <label className="block text-sm font-medium text-[var(--color-navy)]">
        Password
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            className={`${inputClass} pr-10`}
            placeholder="Minimum 8 characters"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] transition hover:text-[var(--color-navy)]"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </label>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-[var(--color-red)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isPending}
        className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-navy)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)] disabled:opacity-70"
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        {isPending
          ? mode === "signup" ? "Creating Account..." : "Signing In..."
          : mode === "signup" ? "Create Account" : "Log In"
        }
      </button>

      <p className="text-center text-sm text-[var(--color-muted)]">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-[var(--color-gold)] hover:underline">
              Log in
            </a>
          </>
        ) : (
          <>
            No account yet?{" "}
            <a href="/signup" className="font-semibold text-[var(--color-gold)] hover:underline">
              Sign up free
            </a>
          </>
        )}
      </p>
    </form>
  );
}
