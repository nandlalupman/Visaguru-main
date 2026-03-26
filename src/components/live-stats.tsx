"use client";

import { useEffect, useRef, useState } from "react";

type Stats = {
  users: number;
  submissions: number;
  statusBreakdown: {
    new: number;
    in_review: number;
    resolved: number;
  };
};

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || target === 0) return;
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span ref={ref} className="count-pop">{value}</span>;
}

const cards = [
  { key: "users", label: "Registered users", icon: "👤" },
  { key: "submissions", label: "Submissions", icon: "📋" },
  { key: "in_review", label: "In review", icon: "🔍" },
  { key: "resolved", label: "Resolved", icon: "✅" },
] as const;

export function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await fetch("/api/stats", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as Stats;
      if (mounted) setStats(data);
    };
    void load();
    const timer = setInterval(() => void load(), 15000);
    return () => { mounted = false; clearInterval(timer); };
  }, []);

  const getValue = (key: string): number => {
    if (!stats) return 0;
    if (key === "users") return stats.users;
    if (key === "submissions") return stats.submissions;
    if (key === "in_review") return stats.statusBreakdown.in_review;
    if (key === "resolved") return stats.statusBreakdown.resolved;
    return 0;
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <article key={card.key} className="surface-card relative overflow-hidden rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
              {card.label}
            </p>
            <span className="text-lg">{card.icon}</span>
          </div>
          <p className="mt-3 text-3xl font-semibold text-[var(--color-navy)]">
            {stats ? <AnimatedNumber target={getValue(card.key)} /> : (
              <span className="skeleton inline-block h-8 w-16" />
            )}
          </p>
          {/* Live indicator */}
          <div className="mt-3 flex items-center gap-1.5">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-[var(--color-green)]" />
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">Live</span>
          </div>
        </article>
      ))}
    </div>
  );
}
