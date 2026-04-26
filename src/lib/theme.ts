"use client";

import { useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark" | "system";
const KEY = "vellum-theme";

function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as Theme | null) ?? "system";
    setThemeState(saved);
    setMounted(true);
  }, []);

  // Re-apply if system preference changes while user is on `system`.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(KEY, next);
    applyTheme(next);
  }, []);

  return { theme, setTheme, mounted };
}
