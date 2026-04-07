"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, MessageCircle, CheckCircle2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type QRPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: string;
};

const WHATSAPP_NUMBER = "917737099474";

export function QRPaymentModal({
  isOpen,
  onClose,
  planName,
  price,
}: QRPaymentModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const whatsappMessage = encodeURIComponent(
    `Hi VisaGuru! 👋\n\nI have made the payment for *${planName}* plan (${price}).\n\nPlease find my payment screenshot attached.\n\nName: \nEmail: `,
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("kusum@phonepe");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-[var(--color-navy)] to-[#31456D] px-6 py-5 text-white">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                Payment for
              </p>
              <h3 className="mt-1 text-xl font-semibold">{planName}</h3>
              <p className="mt-1 font-mono text-2xl font-bold text-[var(--color-gold)]">
                {price}
              </p>
            </div>

            {/* Steps */}
            <div className="px-6 pt-5">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-gold)] text-xs font-bold text-white">
                    1
                  </span>
                  <span className="mt-1 h-8 w-px bg-[var(--color-border)]" />
                </div>
                <p className="text-sm text-[var(--color-muted)] pt-0.5">
                  Scan the QR code below & pay <strong className="text-[var(--color-navy)]">{price}</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-gold)] text-xs font-bold text-white">
                    2
                  </span>
                  <span className="mt-1 h-8 w-px bg-[var(--color-border)]" />
                </div>
                <p className="text-sm text-[var(--color-muted)] pt-0.5">
                  Take a <strong className="text-[var(--color-navy)]">screenshot</strong> of the payment
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-green)] text-xs font-bold text-white">
                    3
                  </span>
                </div>
                <p className="text-sm text-[var(--color-muted)] pt-0.5">
                  Send screenshot on <strong className="text-[var(--color-navy)]">WhatsApp</strong> to confirm
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center px-6 py-5">
              <div className="rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <Image
                  src="/images/payment-qr.png"
                  alt="UPI Payment QR Code"
                  width={220}
                  height={220}
                  className="h-auto w-[220px] rounded-xl"
                />
              </div>

              {/* UPI ID */}
              <div className="mt-3 flex items-center gap-2">
                <p className="text-xs text-[var(--color-muted)]">
                  UPI ID: <span className="font-mono font-semibold text-[var(--color-navy)]">kusum@phonepe</span>
                </p>
                <button
                  type="button"
                  onClick={handleCopyUPI}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-muted)] transition hover:bg-[var(--color-surface)]"
                  title="Copy UPI ID"
                >
                  {copied ? <Check size={12} className="text-[var(--color-green)]" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            {/* WhatsApp Button */}
            <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <MessageCircle size={18} />
                Send Payment Screenshot on WhatsApp
              </a>
              <p className="mt-3 flex items-start gap-1.5 text-[11px] text-[var(--color-muted)]">
                <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-[var(--color-green)]" />
                Your service will be activated within 2 hours of payment confirmation.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
