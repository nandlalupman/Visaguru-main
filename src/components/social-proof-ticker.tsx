type SocialProofTickerProps = {
  items: string[];
};

export function SocialProofTicker({ items }: SocialProofTickerProps) {
  const repeated = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-surface)] py-3">
      <div className="ticker-track">
        {repeated.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="whitespace-nowrap rounded-full border border-[var(--color-border)] px-4 py-1 text-xs font-medium text-[var(--color-muted)]"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
