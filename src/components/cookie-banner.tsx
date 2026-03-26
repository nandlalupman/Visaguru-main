"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_KEY = "visaguru_cookie_ok";

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (typeof window === "undefined") {
    return null;
  }

  let accepted: string | null = null;
  try {
    accepted = window.localStorage.getItem(COOKIE_KEY);
  } catch {
    accepted = "1";
  }

  const visible = !dismissed && !accepted;

  const accept = () => {
    try {
      window.localStorage.setItem(COOKIE_KEY, "1");
    } catch {
      // Ignore storage write errors
    }
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg backdrop-blur"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
            <p className="text-[var(--color-muted)]">
              We use essential cookies and privacy-safe analytics to improve the
              experience. By continuing, you agree to our{" "}
              <a
                href="/cookie-policy"
                className="underline hover:text-[var(--color-navy)]"
              >
                cookie policy
              </a>
              .
            </p>
            <button
              type="button"
              className="shrink-0 rounded-full bg-[var(--color-navy)] px-5 py-2 font-semibold text-white transition hover:bg-[var(--color-navy-light)]"
              onClick={accept}
            >
              Accept and Continue
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
