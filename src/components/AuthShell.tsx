"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export type AuthMode = "login" | "signup";

interface AuthShellProps {
  mode: AuthMode;
  errorMessage?: string;
  isPending?: boolean;
  onEmailSubmit: (vars: { email: string; password: string }) => Promise<void>;
  onGoogleCredential: (idToken: string) => void;
  googlePending?: boolean;
}

const COPY: Record<
  AuthMode,
  {
    eyebrow: string;
    heading: ReactNode;
    sub: string;
    submit: string;
    altQ: string;
    altLink: string;
    altHref: string;
    googleText: "signin_with" | "signup_with";
  }
> = {
  login: {
    eyebrow: "Welcome back",
    heading: (
      <>
        Good to see you
        <br />
        <span className="text-primary">again.</span>
      </>
    ),
    sub: "Sign in with Google, or use your email and password — whichever you prefer.",
    submit: "Log in",
    altQ: "New here?",
    altLink: "Create an account",
    altHref: "/signup",
    googleText: "signin_with",
  },
  signup: {
    eyebrow: "Get started",
    heading: (
      <>
        Send money
        <br />
        <span className="text-primary">in minutes.</span>
      </>
    ),
    sub: "Create your account with Google, or use an email and password — whichever you prefer.",
    submit: "Create account",
    altQ: "Already have an account?",
    altLink: "Log in",
    altHref: "/login",
    googleText: "signup_with",
  },
};

export function AuthShell({
  mode,
  errorMessage,
  isPending,
  onEmailSubmit,
  onGoogleCredential,
  googlePending,
}: AuthShellProps) {
  const copy = COPY[mode];

  return (
    <div className="grid min-h-[calc(100vh-9rem)] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Editorial hero — left column */}
      <section className="lg:col-span-6 lg:col-start-1 lg:pt-10">
        <p className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
          {copy.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-display-lg font-bold tracking-tight text-on_surface">
          {copy.heading}
        </h1>
        <p className="mt-6 max-w-md font-body text-body-lg text-on_surface-variant">
          {copy.sub}
        </p>

        <Marginalia mode={mode} />
      </section>

      {/* Auth card — right column */}
      <section className="lg:col-span-6 lg:col-start-7 lg:pt-10">
        <div className="rounded-2xl bg-surface-container-lowest p-7 shadow-ambient sm:p-9">
          <p className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
            {mode === "login" ? "Sign in" : "Sign up"}
          </p>

          <div className="mt-5 flex justify-center">
            <GoogleSignInButton
              text={copy.googleText}
              disabled={googlePending}
              onCredential={onGoogleCredential}
            />
          </div>

          <Divider />

          <EmailDisclosure
            mode={mode}
            isPending={isPending}
            onSubmit={onEmailSubmit}
          />

          {errorMessage && (
            <div className="mt-5 rounded-xl bg-error/8 px-4 py-3 font-body text-body-md text-error">
              {errorMessage}
            </div>
          )}
        </div>

        <p className="mt-5 text-center font-body text-body-md text-on_surface-variant">
          {copy.altQ}{" "}
          <Link href={copy.altHref} className="btn-tertiary font-medium">
            {copy.altLink}
          </Link>
        </p>
      </section>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-7 flex items-center gap-3 font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
      <span className="h-px flex-1 bg-surface-container-highest" />
      <span>or</span>
      <span className="h-px flex-1 bg-surface-container-highest" />
    </div>
  );
}

interface EmailDisclosureProps {
  mode: AuthMode;
  isPending?: boolean;
  onSubmit: (vars: { email: string; password: string }) => Promise<void>;
}

function EmailDisclosure({ mode, isPending, onSubmit }: EmailDisclosureProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="block w-full rounded-xl bg-surface-container px-5 py-3 text-center font-display text-title-sm font-semibold text-on_surface-variant transition-colors hover:bg-surface-container-high hover:text-on_surface"
      >
        Continue with email
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email, password });
      }}
      className="space-y-4"
    >
      <FloatField
        label="Email address"
        type="email"
        required
        value={email}
        onChange={setEmail}
      />
      <FloatField
        label="Password"
        type="password"
        required
        minLength={8}
        value={password}
        onChange={setPassword}
        hint={mode === "signup" ? "At least 8 characters" : undefined}
      />
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-tertiary font-display text-title-sm"
        >
          Back
        </button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? mode === "signup"
              ? "Creating your account…"
              : "Signing you in…"
            : COPY[mode].submit}
        </Button>
      </div>
    </form>
  );
}

interface FloatFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
  hint?: string;
}

function FloatField({
  label,
  type = "text",
  value,
  onChange,
  required,
  minLength,
  hint,
}: FloatFieldProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <label className="block">
      <span className="block font-label text-label-md uppercase tracking-[0.18em] text-tertiary">
        {label}
      </span>
      <div className="relative mt-1.5">
        <input
          type={type}
          required={required}
          minLength={minLength}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-xl bg-surface-container-highest px-4 py-3 font-body text-body-lg text-on_surface placeholder-on_surface-variant outline-none"
        />
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-3 bottom-0 h-[2px] origin-left rounded-full bg-primary transition-transform duration-200 ${
            lifted ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </div>
      {hint && (
        <span className="mt-1 block font-label text-label-sm uppercase tracking-[0.16em] text-on_surface-variant">
          {hint}
        </span>
      )}
    </label>
  );
}

function Marginalia({ mode }: { mode: AuthMode }) {
  const items =
    mode === "signup"
      ? [
          ["01", "Pick a currency. See today's rate."],
          ["02", "Save the rate you like."],
          ["03", "Send the money when you're ready."],
        ]
      : [
          ["01", "Pick up where you left off."],
          ["02", "Today's rates are ready for you."],
          ["03", "Only you can see your transfers."],
        ];

  return (
    <ul className="mt-12 hidden space-y-4 lg:block">
      {items.map(([k, v]) => (
        <li key={k} className="flex items-baseline gap-5">
          <span className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
            {k}
          </span>
          <span className="font-body text-body-md text-on_surface">{v}</span>
        </li>
      ))}
    </ul>
  );
}
