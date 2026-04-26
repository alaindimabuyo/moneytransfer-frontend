"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { QuoteForm, type QuoteFormValues } from "@/components/QuoteForm";
import { QuoteCard } from "@/components/QuoteCard";
import { RecipientForm, type RecipientFormValues } from "@/components/RecipientForm";
import { FrequentPairs } from "@/components/FrequentPairs";
import { RateTrendChart } from "@/components/RateTrendChart";
import { PageLoader } from "@/components/ui/Loaders";
import type { Quote, TransferRequest } from "@/types/api";

interface CreateQuoteResponse {
  quote: Quote;
  cacheStatus: "hit" | "miss" | "stale_fallback";
}

export default function QuotePage() {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  const [latest, setLatest] = useState<CreateQuoteResponse | null>(null);

  // Hoisted form state — frequent-pair chips need to set these.
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  const createQuote = useMutation({
    mutationFn: async (vars: QuoteFormValues) =>
      api<CreateQuoteResponse>("/quotes", {
        method: "POST",
        body: JSON.stringify(vars),
      }),
    onSuccess: (data) => setLatest(data),
  });

  const submitTransfer = useMutation({
    mutationFn: async (args: { quoteId: string } & RecipientFormValues) =>
      api<{ transfer: TransferRequest }>("/transfers", {
        method: "POST",
        body: JSON.stringify(args),
      }),
    onSuccess: () => router.push("/history"),
  });

  if (isLoading) return <PageLoader />;
  if (!user) return null;

  const handleRefresh = () => {
    if (!latest) return;
    createQuote.mutate({
      sourceCurrency: latest.quote.sourceCurrency,
      targetCurrency: latest.quote.targetCurrency,
      sourceAmount: Number(latest.quote.sourceAmount),
    });
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      {/* Editorial hero — left aligned, intentionally asymmetric */}
      <header className="lg:col-span-7 lg:col-start-1">
        <p className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
          New transfer
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-on_surface sm:text-display-lg">
          Send money
          <br />
          <span className="text-primary">across borders.</span>
        </h1>
        <p className="mt-5 max-w-md font-body text-body-lg text-on_surface-variant">
          Pick what you&apos;re sending and where it&apos;s going. We&apos;ll
          show you the rate, the fee, and what your recipient gets — all
          before you commit.
        </p>
      </header>

      <div className="lg:col-span-12">
        <FrequentPairs
          onPick={(s, t) => {
            setSourceCurrency(s);
            setTargetCurrency(t);
          }}
        />
      </div>

      <div className="lg:col-span-12">
        <QuoteForm
          onSubmit={(vars) => createQuote.mutate(vars)}
          isPending={createQuote.isPending}
          sourceCurrency={sourceCurrency}
          targetCurrency={targetCurrency}
          onSourceCurrencyChange={setSourceCurrency}
          onTargetCurrencyChange={setTargetCurrency}
        />
      </div>

      {sourceCurrency !== targetCurrency && (
        <div className="lg:col-span-12">
          <RateTrendChart source={sourceCurrency} target={targetCurrency} />
        </div>
      )}

      {createQuote.error instanceof ApiClientError && (
        <div className="rounded-2xl bg-error/8 px-5 py-4 font-body text-body-md text-error lg:col-span-12">
          {createQuote.error.message}
        </div>
      )}

      {latest && (
        <div className="lg:col-span-12">
          <QuoteCard
            quote={latest.quote}
            cacheStatus={latest.cacheStatus}
            onRefresh={handleRefresh}
            refreshing={createQuote.isPending}
          />
        </div>
      )}

      {latest && latest.quote.status === "active" && (
        <div className="lg:col-span-12">
          <RecipientForm
            disabled={submitTransfer.isPending}
            onSubmit={(recipient) =>
              submitTransfer.mutate({ quoteId: latest.quote.id, ...recipient })
            }
          />
        </div>
      )}

      {submitTransfer.error instanceof ApiClientError && (
        <div className="rounded-2xl bg-error/8 px-5 py-4 font-body text-body-md text-error lg:col-span-12">
          {submitTransfer.error.message}
        </div>
      )}
    </div>
  );
}
