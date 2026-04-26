"use client";

import { useEffect, useRef, useState } from "react";

const GIS_SRC = "https://accounts.google.com/gsi/client";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (opts: {
            client_id: string;
            callback: (resp: { credential: string }) => void;
            ux_mode?: "popup" | "redirect";
            auto_select?: boolean;
          }) => void;
          renderButton: (
            container: HTMLElement,
            opts: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "small" | "medium" | "large";
              text?: "signin_with" | "signup_with" | "continue_with";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number | string;
            }
          ) => void;
        };
      };
    };
  }
}

let scriptPromise: Promise<void> | null = null;
function loadGisScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GIS_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("gsi_failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("gsi_failed"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => void;
  text?: "signin_with" | "signup_with" | "continue_with";
  disabled?: boolean;
}

export function GoogleSignInButton({
  onCredential,
  text = "continue_with",
  disabled,
}: GoogleSignInButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !ref.current) return;
    let cancelled = false;
    loadGisScript()
      .then(() => {
        if (cancelled || !ref.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (resp) => onCredential(resp.credential),
        });
        window.google.accounts.id.renderButton(ref.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text,
          shape: "rectangular",
          logo_alignment: "left",
          width: 320,
        });
      })
      .catch(() => setError("Could not load Google sign-in"));
    return () => {
      cancelled = true;
    };
  }, [clientId, onCredential, text]);

  if (!clientId) {
    return (
      <p className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-500">
        Google sign-in is not configured. Set{" "}
        <code className="font-mono">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div
        ref={ref}
        aria-label="Google sign-in"
        className={disabled ? "pointer-events-none opacity-50" : undefined}
      />
      {error && (
        <p className="text-xs text-red-700">{error}</p>
      )}
    </div>
  );
}
