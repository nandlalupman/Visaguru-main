"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EXIT_MODAL_KEY = "visaguru_exit_modal_seen";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = window.sessionStorage.getItem(EXIT_MODAL_KEY);
    if (seen) return;

    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 8) {
        setOpen(true);
        window.sessionStorage.setItem(EXIT_MODAL_KEY, "1");
      }
    };

    document.addEventListener("mouseout", onMouseLeave);
    return () => document.removeEventListener("mouseout", onMouseLeave);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,16,34,0.5)] p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="surface-card relative w-full max-w-lg rounded-3xl p-8"
            style={{ transform: "none" }}
          >
            {/* Close Button */}
            <button
              type="button"
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-muted)] transition hover:bg-[var(--color-bg)] hover:text-[var(--color-navy)]"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <p className="inline-flex rounded-full bg-[#fff7ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">
              Before you leave
            </p>
            <h3 className="mt-3 text-3xl text-[var(--color-navy)]">
              Get a free 15-min consultation call
            </h3>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Share your refusal letter and we will map the top three recovery
              actions for your next filing.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#free-analysis"
                className="btn-shimmer inline-flex items-center justify-center rounded-full bg-[var(--color-gold)] px-6 py-2.5 text-sm font-semibold text-white transition hover:shadow-[var(--shadow-gold)]"
                onClick={() => setOpen(false)}
              >
                Get Free Analysis
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]"
                onClick={() => setOpen(false)}
              >
                Continue Browsing
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
