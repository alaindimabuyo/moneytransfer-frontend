"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-display text-title-sm font-semibold transition-[transform,opacity,background] duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const styles: Record<Variant, string> = {
  primary:
    "bg-gradient-cta text-on_primary shadow-ambient hover:opacity-95 active:translate-y-px",
  secondary:
    "bg-surface-container-high text-primary hover:bg-surface-container-highest",
  tertiary: "btn-tertiary px-1 py-1",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", full, className = "", ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`${base} ${styles[variant]} ${full ? "w-full" : ""} ${className}`}
        {...rest}
      />
    );
  }
);
Button.displayName = "Button";
