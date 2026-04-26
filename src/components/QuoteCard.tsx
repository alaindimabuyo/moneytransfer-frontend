"use client";

import type { Quote } from "@/types/api";
import { Button } from "@/components/ui/Button";
import {
  StatusRibbon,
  StatusWord,
  statusToTone,
  friendlyStatus,
} from "@/components/ui/StatusRibbon";

function fmtMoney(amount: string, currency: string) {
  const n = Number(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtRate(rate: string) {
  const n = Number(rate);
  return n >= 1 ? n.toFixed(4) : n.toPrecision(4);
}

export function QuoteCard({
  quote,
  onSubmit,
  submitting,
  cacheStatus,
}: {
  quote: Quote;
  onSubmit?: () => void;
  submitting?: boolean;
  cacheStatus?: "hit" | "miss" | "stale_fallback";
}) {
  const expiresInMs = new Date(quote.expiresAt).getTime() - Date.now();
  const expired = quote.status === "expired" || expiresInMs <= 0;
  const tone = expired ? "neutral" : statusToTone(quote.status);

  return (
    <StatusRibbon tone={tone} className="bg-surface-container-lowest shadow-ambient">
      <div className="grid grid-cols-1 gap-8 p-7 pl-9 sm:grid-cols-5 sm:p-9 sm:pl-12">
        <div className="sm:col-span-3">
          <div className="flex items-center justify-between">
            <p className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
              Your quote
            </p>
            <StatusWord status={friendlyStatus(quote.status)} />
          </div>
          <p className="mt-3 font-display text-display-md font-bold tabular text-on_surface">
            {fmtMoney(quote.targetAmount, quote.targetCurrency)}
          </p>
          <p className="mt-1 font-body text-body-md text-on_surface-variant">
            Your recipient gets this much
          </p>
        </div>

        <dl className="space-y-3 sm:col-span-2">
          <Row
            label="You send"
            value={fmtMoney(quote.sourceAmount, quote.sourceCurrency)}
          />
          <Row
            label="Fee"
            value={fmtMoney(quote.feeAmount, quote.sourceCurrency)}
          />
          <Row
            label="Rate"
            value={`1 ${quote.sourceCurrency} = ${fmtRate(quote.rate)} ${quote.targetCurrency}`}
          />
        </dl>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-7 pb-7 pl-9 sm:px-9 sm:pl-12">
        <p className="font-body text-body-md text-on_surface-variant">
          {expired
            ? "This quote has expired — start a new one above."
            : `This rate is locked for ${formatExpiry(expiresInMs)}.`}
        </p>
        {onSubmit && quote.status === "active" && !expired && (
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? "Sending…" : "Send transfer"}
          </Button>
        )}
      </div>
    </StatusRibbon>
  );
}

function formatExpiry(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  if (totalSec >= 60) {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return sec === 0 ? `${min} min` : `${min} min ${sec}s`;
  }
  return `${totalSec} seconds`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="font-label text-label-md uppercase tracking-[0.18em] text-tertiary">
        {label}
      </dt>
      <dd className="font-display text-title-md tabular text-on_surface">
        {value}
      </dd>
    </div>
  );
}
