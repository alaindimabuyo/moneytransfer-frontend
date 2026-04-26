import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surface tiers (no-line rule depends on this)
        surface: {
          DEFAULT: "#f9f9ff",
          dim: "#d8dae2",
          container: {
            lowest: "#ffffff",
            low: "#f2f3fc",
            DEFAULT: "#ecedf6",
            high: "#e6e7f0",
            highest: "#e1e2ea",
          },
        },
        on_surface: {
          DEFAULT: "#191c21",
          variant: "#59413c",
        },
        // Brand
        primary: {
          DEFAULT: "#af2d19",
          container: "#d1462f",
        },
        on_primary: "#ffffff",
        secondary: {
          DEFAULT: "#006b5b",
          container: "#96f1da",
        },
        tertiary: "#575d69",
        outline: {
          variant: "#e1bfb8",
        },
        // Semantic
        error: "#ba1a1a",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        label: ["var(--font-label)", "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.04em" }],
        "display-md": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "title-lg": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "title-md": ["1.125rem", { lineHeight: "1.3" }],
        "title-sm": ["0.9375rem", { lineHeight: "1.3", letterSpacing: "0.005em" }],
        "body-lg": ["1rem", { lineHeight: "1.55" }],
        "body-md": ["0.875rem", { lineHeight: "1.55" }],
        "label-md": ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.04em" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.06em" }],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      backdropBlur: {
        glass: "20px",
      },
      backgroundImage: {
        "gradient-cta":
          "linear-gradient(135deg, #af2d19 0%, #d1462f 100%)",
      },
      boxShadow: {
        // Tinted on_surface, low opacity — DESIGN.MD ambient shadow rule
        ambient: "0 24px 48px -16px rgba(25, 28, 33, 0.06)",
        "ambient-lg": "0 32px 64px -20px rgba(25, 28, 33, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
