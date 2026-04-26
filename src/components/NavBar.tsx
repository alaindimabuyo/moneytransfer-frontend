"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useLogout } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export function NavBar() {
  const { data: user } = useUser();
  const logout = useLogout();
  const router = useRouter();
  const path = usePathname();

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-title-lg font-bold tracking-tight text-on_surface"
        >
          Vellum
        </Link>

        {/* Right cluster: nav pill + identity pill */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <nav className="flex items-center gap-1 rounded-2xl bg-surface-container-lowest/80 px-2 py-1 shadow-ambient backdrop-blur-glass">
                <NavLink href="/quote" active={path?.startsWith("/quote")}>
                  New transfer
                </NavLink>
                <NavLink href="/history" active={path?.startsWith("/history")}>
                  History
                </NavLink>
              </nav>
              <UserMenu
                email={user.email}
                onLogout={() =>
                  logout.mutate(undefined, {
                    onSuccess: () => router.push("/login"),
                  })
                }
              />
            </>
          ) : (
            <nav className="flex items-center gap-1 rounded-2xl bg-surface-container-lowest/80 px-2 py-1 shadow-ambient backdrop-blur-glass">
              <NavLink href="/login" active={path === "/login"}>
                Log in
              </NavLink>
              <Link href="/signup" className="ml-1">
                <Button variant="primary">Sign up</Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

function UserMenu({
  email,
  onLogout,
}: {
  email: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const initial = email.charAt(0).toUpperCase();
  const name = email.split("@")[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex items-center gap-2 rounded-2xl bg-surface-container-lowest/80 px-2 py-1 shadow-ambient backdrop-blur-glass transition-colors hover:bg-surface-container-lowest"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-cta font-display text-title-sm font-bold text-on_primary"
        >
          {initial}
        </span>
        <span className="hidden max-w-[10rem] truncate pr-2 font-display text-title-sm text-on_surface sm:inline">
          {name}
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-ambient-lg"
        >
          <div className="px-4 py-3">
            <p className="font-label text-label-sm uppercase tracking-[0.18em] text-on_surface-variant">
              Signed in as
            </p>
            <p className="mt-1 truncate font-body text-body-md text-on_surface">
              {email}
            </p>
          </div>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onLogout();
            }}
            className="block w-full bg-surface-container-low px-4 py-3 text-left font-display text-title-sm text-on_surface transition-colors hover:bg-surface-container"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl px-3 py-2 font-display text-title-sm transition-colors ${
        active
          ? "bg-surface-container text-on_surface"
          : "text-on_surface-variant hover:text-on_surface"
      }`}
    >
      {children}
    </Link>
  );
}
