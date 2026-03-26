"use client";

import { MessageSquare, Send, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ChatMessage = {
  role: "user" | "bot";
  content: string;
};

type SessionResponse = {
  authenticated?: boolean;
};

type ChatResponse = {
  reply?: string;
  loginUrl?: string;
};

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content:
        "Hi! I'm the VisaGuru Assistant. Tell me your visa type and refusal reason, and I'll guide you to the right solution.",
    },
  ]);
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "guest">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await response.json()) as SessionResponse;
        if (!cancelled) {
          setAuthState(data.authenticated ? "authenticated" : "guest");
        }
      } catch {
        if (!cancelled) setAuthState("guest");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    startTransition(async () => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const result = (await response.json()) as ChatResponse;
      if (response.status === 401) {
        window.location.assign(result.loginUrl ?? "/login?next=/");
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            result.reply ??
            "I could not answer that right now. Please use WhatsApp for instant support.",
        },
      ]);
    });
  };

  if (authState !== "authenticated") return null;

  return (
    <>
      <motion.button
        type="button"
        className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--color-navy)] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={18} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageSquare size={18} />
            </motion.span>
          )}
        </AnimatePresence>
        {open ? "Close Chat" : "Ask VisaBot"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-20 left-5 z-40 flex h-[460px] w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-[var(--color-border)] bg-[var(--color-navy)] px-4 py-3">
              <p className="text-sm font-semibold text-white">
                VisaGuru Assistant
              </p>
              <p className="text-xs text-white/70">
                Instant guidance · Human support via WhatsApp
              </p>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    message.role === "user"
                      ? "ml-auto bg-[var(--color-navy)] text-white rounded-br-md"
                      : "bg-[var(--color-bg)] text-[var(--color-navy)] rounded-bl-md"
                  }`}
                >
                  {message.content}
                </motion.div>
              ))}
              {isPending && (
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-[var(--color-bg)] px-3.5 py-3 text-sm text-[var(--color-muted)]">
                  <div className="typing-dots flex gap-1.5">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-[var(--color-border)] p-3">
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  send();
                }}
              >
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about refusal, SOP, pricing..."
                  className="w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-gold)]"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-gold)] text-white transition hover:brightness-110 disabled:opacity-60"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
