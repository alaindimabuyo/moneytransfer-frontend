"use client";

/**
 * Editorial loaders — pure opacity / shimmer motion only.
 * No spinners, no rotation, no harsh borders. Matches DESIGN.MD §4.
 */

export function Pulse({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-flex items-center gap-1 align-middle ${className}`}
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full bg-on_surface-variant animate-pulse"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5"
    >
      <span
        aria-hidden
        className="loader-breathe flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-cta font-display text-display-md font-bold text-on_primary shadow-ambient"
      >
        V
      </span>
      <span className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
        {label}
      </span>
    </div>
  );
}

interface SkeletonProps {
  tone?: "lowest" | "low";
  className?: string;
}

/**
 * One row-shaped placeholder. Matches the geometry of the real list rows
 * in /history (rounded-2xl, ~84px tall after padding). Two thin pill bars
 * inside echo "title + caption" content shape.
 */
export function Skeleton({ tone = "lowest", className = "" }: SkeletonProps) {
  const bg =
    tone === "lowest"
      ? "bg-surface-container-lowest"
      : "bg-surface-container-low";
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`loader-shimmer rounded-2xl ${bg} px-5 py-5 pl-7 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-3 w-2/5 rounded-full bg-surface-container-highest" />
          <div className="h-2.5 w-3/5 rounded-full bg-surface-container-high" />
        </div>
        <div className="h-2.5 w-14 rounded-full bg-surface-container-highest" />
      </div>
    </div>
  );
}
