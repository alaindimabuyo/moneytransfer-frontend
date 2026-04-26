"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const COUNTRIES: Array<{ code: string; name: string }> = [
  { code: "US", name: "United States" },
  { code: "PH", name: "Philippines" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "MX", name: "Mexico" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
];

export interface RecipientFormValues {
  recipientName: string;
  recipientAccount?: string;
  recipientCountry?: string;
  recipientEmail?: string;
}

export interface RecipientFormProps {
  onSubmit: (values: RecipientFormValues) => void;
  disabled?: boolean;
}

export function RecipientForm({ onSubmit, disabled }: RecipientFormProps) {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");

  const valid = name.trim().length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onSubmit({
          recipientName: name.trim(),
          recipientAccount: account.trim() || undefined,
          recipientCountry: country || undefined,
          recipientEmail: email.trim() || undefined,
        });
      }}
      className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient sm:p-8"
    >
      <header className="mb-6">
        <p className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
          Who&apos;s receiving this?
        </p>
        <h3 className="mt-2 font-display text-title-lg font-semibold text-on_surface">
          Recipient details
        </h3>
        <p className="mt-1 font-body text-body-md text-on_surface-variant">
          Only the name is required. The rest helps identify the transfer.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FloatField
          label="Full name"
          value={name}
          onChange={setName}
          required
          autoFocus
        />
        <FloatField
          label="Email (optional)"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <FloatField
          label="Account or IBAN (optional)"
          value={account}
          onChange={setAccount}
        />
        <CountrySelect value={country} onChange={setCountry} />
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <p className="font-body text-body-md text-on_surface-variant">
          We&apos;ll send confirmation when the transfer is processed.
        </p>
        <Button type="submit" disabled={disabled || !valid}>
          {disabled ? "Sending…" : "Send transfer"}
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
  autoFocus?: boolean;
}

function FloatField({
  label,
  type = "text",
  value,
  onChange,
  required,
  autoFocus,
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
          autoFocus={autoFocus}
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
    </label>
  );
}

function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block font-label text-label-md uppercase tracking-[0.18em] text-tertiary">
        Country (optional)
      </span>
      <div className="relative mt-1.5">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full appearance-none rounded-xl bg-surface-container-highest px-4 py-3 pr-9 font-body text-body-lg text-on_surface outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">—</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
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
    </label>
  );
}
