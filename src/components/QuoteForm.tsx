"use client";

import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "MXN",
  "INR",
  "BRL",
  "PHP",
];

export interface QuoteFormValues {
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
}

export interface QuoteFormProps {
  onSubmit: (vars: QuoteFormValues) => void;
  isPending?: boolean;
  sourceCurrency: string;
  targetCurrency: string;
  onSourceCurrencyChange: (v: string) => void;
  onTargetCurrencyChange: (v: string) => void;
}

export function QuoteForm({
  onSubmit,
  isPending,
  sourceCurrency,
  targetCurrency,
  onSourceCurrencyChange,
  onTargetCurrencyChange,
}: QuoteFormProps) {
  const [amount, setAmount] = useState("1000");

  // Keep target valid when source changes (e.g. via frequent-pair chip).
  useEffect(() => {
    if (sourceCurrency === targetCurrency) {
      const next = CURRENCIES.find((c) => c !== sourceCurrency);
      if (next) onTargetCurrencyChange(next);
    }
  }, [sourceCurrency, targetCurrency, onTargetCurrencyChange]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = Number(amount);
        if (!Number.isFinite(parsed) || parsed <= 0) return;
        onSubmit({ sourceCurrency, targetCurrency, sourceAmount: parsed });
      }}
      className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient sm:p-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
        <div className="sm:col-span-5">
          <FieldLabel>You send</FieldLabel>
          <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <Select
              value={sourceCurrency}
              onChange={onSourceCurrencyChange}
              options={CURRENCIES}
            />
            <NumberInput value={amount} onChange={setAmount} />
          </div>
        </div>
        <div className="hidden items-end justify-center pb-3 sm:col-span-2 sm:flex">
          <span
            aria-hidden
            className="font-display text-title-lg text-on_surface-variant"
          >
            →
          </span>
        </div>
        <div className="sm:col-span-5">
          <FieldLabel>Recipient gets</FieldLabel>
          <div className="mt-1.5">
            <Select
              value={targetCurrency}
              onChange={onTargetCurrencyChange}
              options={CURRENCIES.filter((c) => c !== sourceCurrency)}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-body text-body-md text-on_surface-variant">
          Small fee, real rates. No hidden markup.
        </p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Getting your rate…" : "See the rate"}
        </Button>
      </div>
    </form>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-label text-label-md uppercase tracking-[0.18em] text-tertiary">
      {children}
    </span>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full appearance-none rounded-xl bg-surface-container-highest px-4 py-3 pr-9 font-display text-title-md font-semibold text-on_surface outline-none focus:ring-2 focus:ring-primary/30 sm:w-auto"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-label text-label-sm text-on_surface-variant"
      >
        ▾
      </span>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="number"
      min="0.01"
      step="0.01"
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="tabular w-full rounded-xl bg-surface-container-highest px-4 py-3 text-right font-display text-title-lg font-semibold text-on_surface outline-none focus:ring-2 focus:ring-primary/30"
    />
  );
}
