"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface TopPair {
  sourceCurrency: string;
  targetCurrency: string;
  count: number;
}

interface FrequentPairsProps {
  onPick: (source: string, target: string) => void;
}

export function FrequentPairs({ onPick }: FrequentPairsProps) {
  const { data } = useQuery({
    queryKey: ["topPairs"],
    queryFn: () => api<{ pairs: TopPair[] }>("/quotes/top-pairs"),
    staleTime: 60_000,
  });

  const pairs = data?.pairs ?? [];
  if (pairs.length === 0) return null;

  return (
    <section aria-label="Frequently used currency pairs">
      <p className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
        Pick up where you left off
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {pairs.map((p) => (
          <button
            key={`${p.sourceCurrency}-${p.targetCurrency}`}
            type="button"
            onClick={() => onPick(p.sourceCurrency, p.targetCurrency)}
            className="group inline-flex items-center gap-2 rounded-full bg-surface-container-lowest px-4 py-2 shadow-ambient transition-transform hover:-translate-y-px"
          >
            <span className="font-display text-title-sm font-semibold text-on_surface">
              {p.sourceCurrency}
            </span>
            <span aria-hidden className="text-on_surface-variant">
              →
            </span>
            <span className="font-display text-title-sm font-semibold text-on_surface">
              {p.targetCurrency}
            </span>
            <span className="ml-1 font-label text-label-sm uppercase tracking-[0.18em] text-on_surface-variant">
              ×{p.count}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
