"use client";

import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "active" | "warn" | "error";

const toneToColor: Record<Tone, string> = {
  neutral: "bg-surface-dim",
  success: "bg-secondary",
  active: "bg-primary",
  warn: "bg-on_surface-variant",
  error: "bg-error",
};

export interface StatusRibbonProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

/**
 * Editorial container with a 4px left ribbon. Replaces the role of
 * standard "chips with borders" — see DESIGN.MD §5 Specialized.
 */
export function StatusRibbon({
  tone = "neutral",
  children,
  className = "",
}: StatusRibbonProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${toneToColor[tone]}`}
      />
      {children}
    </div>
  );
}

export function statusToTone(status: string): Tone {
  switch (status) {
    case "active":
    case "completed":
      return "success";
    case "consumed":
    case "processing":
      return "active";
    case "pending":
      return "warn";
    case "failed":
      return "error";
    default:
      return "neutral";
  }
}

/** A tiny inline status word styled per DESIGN.MD label-sm rules. */
export function StatusWord({ status }: { status: string }) {
  return (
    <span className="font-label text-label-sm uppercase tracking-[0.18em] text-on_surface-variant">
      {status}
    </span>
  );
}

/** Map a raw lifecycle status to a user-friendly label. */
export function friendlyStatus(status: string): string {
  switch (status) {
    case "active":
      return "Ready";
    case "expired":
      return "Expired";
    case "consumed":
      return "Sent";
    case "pending":
      return "In progress";
    case "processing":
      return "In progress";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}
