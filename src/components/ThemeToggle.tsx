"use client";

import { useTheme, type Theme } from "@/lib/theme";

const ORDER: Theme[] = ["light", "system", "dark"];

const ICON: Record<Theme, string> = {
  light: "☀",
  system: "◐",
  dark: "☾",
};

const LABEL: Record<Theme, string> = {
  light: "Light",
  system: "System",
  dark: "Dark",
};

export function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  // Pre-hydration: render a placeholder of the same size to avoid layout shift.
  if (!mounted) {
    return (
      <div
        aria-hidden
        className="h-10 w-10 rounded-2xl bg-surface-container-lowest/80 shadow-ambient backdrop-blur-glass"
      />
    );
  }

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={`Theme: ${LABEL[theme]} — click to switch to ${LABEL[next]}`}
      aria-label={`Theme is ${LABEL[theme].toLowerCase()}. Switch to ${LABEL[next].toLowerCase()}.`}
      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-container-lowest/80 text-base text-on_surface shadow-ambient backdrop-blur-glass transition-colors hover:bg-surface-container-lowest"
    >
      <span aria-hidden>{ICON[theme]}</span>
    </button>
  );
}
