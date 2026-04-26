"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { QuoteForm } from "@/components/QuoteForm";
import { QuoteCard } from "@/components/QuoteCard";
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

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  const createQuote = useMutation({
    mutationFn: async (vars: {
      sourceCurrency: string;
      targetCurrency: string;
      sourceAmount: number;
    }) => {
      return api<CreateQuoteResponse>("/quotes", {
        method: "POST",
        body: JSON.stringify(vars),
      });
    },
    onSuccess: (data) => setLatest(data),
  });

  const submitTransfer = useMutation({
    mutationFn: async (quoteId: string) => {
      return api<{ transfer: TransferRequest }>("/transfers", {
        method: "POST",
        body: JSON.stringify({ quoteId }),
      });
    },
    onSuccess: () => router.push("/history"),
  });

  if (isLoading) return <PageLoader />;
  if (!user) return null;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      {/* Editorial hero — left aligned, intentionally asymmetric */}
      <header className="lg:col-span-7 lg:col-start-1">
        <p className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
          New transfer
        </p>
        <h1 className="mt-3 font-display text-display-lg font-bold tracking-tight text-on_surface">
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
        <QuoteForm
          onSubmit={(vars) => createQuote.mutate(vars)}
          isPending={createQuote.isPending}
        />
      </div>

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
            onSubmit={() => submitTransfer.mutate(latest.quote.id)}
            submitting={submitTransfer.isPending}
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
