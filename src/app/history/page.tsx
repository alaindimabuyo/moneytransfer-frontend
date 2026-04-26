"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useUser } from "@/lib/auth";
import {
  StatusRibbon,
  StatusWord,
  statusToTone,
  friendlyStatus,
} from "@/components/ui/StatusRibbon";
import { PageLoader, Skeleton } from "@/components/ui/Loaders";
import type { Quote, TransferRequest } from "@/types/api";

type Tab = "quotes" | "transfers";

export default function HistoryPage() {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("transfers");

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  const quotesQuery = useQuery({
    queryKey: ["quotes"],
    queryFn: () => api<{ quotes: Quote[] }>("/quotes"),
    enabled: !!user,
  });

  const transfersQuery = useQuery({
    queryKey: ["transfers"],
    queryFn: () => api<{ transfers: TransferRequest[] }>("/transfers"),
    enabled: !!user,
  });

  if (isLoading) return <PageLoader />;
  if (!user) return null;

  return (
    <div className="space-y-10">
      <header>
        <p className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
          Your activity
        </p>
        <h1 className="mt-3 font-display text-display-md font-bold tracking-tight text-on_surface">
          Everything you&apos;ve sent and saved.
        </h1>
      </header>

      <div className="inline-flex rounded-2xl bg-surface-container-low p-1">
        <TabButton active={tab === "transfers"} onClick={() => setTab("transfers")}>
          Transfers
        </TabButton>
        <TabButton active={tab === "quotes"} onClick={() => setTab("quotes")}>
          Quotes
        </TabButton>
      </div>

      {tab === "transfers" ? (
        <TransfersList
          loading={transfersQuery.isLoading}
          transfers={transfersQuery.data?.transfers ?? []}
        />
      ) : (
        <QuotesList
          loading={quotesQuery.isLoading}
          quotes={quotesQuery.data?.quotes ?? []}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 font-display text-title-sm transition-colors ${
        active
          ? "bg-surface-container-lowest text-on_surface shadow-ambient"
          : "text-on_surface-variant hover:text-on_surface"
      }`}
    >
      {children}
    </button>
  );
}

function TransfersList({
  transfers,
  loading,
}: {
  transfers: TransferRequest[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <ul className="space-y-3">
        <li><Skeleton tone="lowest" /></li>
        <li><Skeleton tone="low" /></li>
        <li><Skeleton tone="lowest" /></li>
      </ul>
    );
  }
  if (transfers.length === 0)
    return <EmptyState text="No transfers yet." />;

  return (
    <ul className="space-y-3">
      {transfers.map((t, i) => (
        <li key={t.id}>
          <StatusRibbon
            tone={statusToTone(t.status)}
            className={i % 2 === 0 ? "bg-surface-container-lowest" : "bg-surface-container-low"}
          >
            <div className="flex items-center justify-between gap-4 p-5 pl-7">
              <div className="min-w-0">
                <p className="font-display text-title-md tabular text-on_surface">
                  {t.quote
                    ? `${fmt(t.quote.sourceAmount, t.quote.sourceCurrency)} → ${fmt(
                        t.quote.targetAmount,
                        t.quote.targetCurrency
                      )}`
                    : "Transfer"}
                </p>
                {t.recipientName && (
                  <p className="mt-1 truncate font-body text-body-md text-on_surface">
                    Sent to {t.recipientName}
                  </p>
                )}
                <p className="mt-1 font-label text-label-sm uppercase tracking-[0.18em] text-on_surface-variant">
                  Submitted {new Date(t.submittedAt).toLocaleString()}
                </p>
              </div>
              <StatusWord status={friendlyStatus(t.status)} />
            </div>
          </StatusRibbon>
        </li>
      ))}
    </ul>
  );
}

function QuotesList({
  quotes,
  loading,
}: {
  quotes: Quote[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <ul className="space-y-3">
        <li><Skeleton tone="lowest" /></li>
        <li><Skeleton tone="low" /></li>
        <li><Skeleton tone="lowest" /></li>
      </ul>
    );
  }
  if (quotes.length === 0)
    return <EmptyState text="No quotes yet." />;

  return (
    <ul className="space-y-3">
      {quotes.map((q, i) => (
        <li key={q.id}>
          <StatusRibbon
            tone={statusToTone(q.status)}
            className={i % 2 === 0 ? "bg-surface-container-lowest" : "bg-surface-container-low"}
          >
            <div className="flex items-center justify-between gap-4 p-5 pl-7">
              <div>
                <p className="font-display text-title-md tabular text-on_surface">
                  {fmt(q.sourceAmount, q.sourceCurrency)} →{" "}
                  {fmt(q.targetAmount, q.targetCurrency)}
                </p>
                <p className="mt-1 font-label text-label-sm uppercase tracking-[0.18em] text-on_surface-variant">
                  Rate {Number(q.rate).toFixed(4)} · Fee{" "}
                  {fmt(q.feeAmount, q.sourceCurrency)} ·{" "}
                  {new Date(q.createdAt).toLocaleString()}
                </p>
              </div>
              <StatusWord status={friendlyStatus(q.status)} />
            </div>
          </StatusRibbon>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-low p-10 text-center">
      <p className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
        Nothing here
      </p>
      <p className="mt-2 font-display text-title-lg text-on_surface">{text}</p>
    </div>
  );
}

function fmt(amount: string, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}
