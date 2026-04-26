import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surface tiers — drive light/dark via CSS variables in globals.css
        surface: {
          DEFAULT: "var(--color-surface)",
          dim: "var(--color-surface-dim)",
          container: {
            lowest: "var(--color-surface-container-lowest)",
            low: "var(--color-surface-container-low)",
            DEFAULT: "var(--color-surface-container)",
            high: "var(--color-surface-container-high)",
            highest: "var(--color-surface-container-highest)",
          },
        },
        on_surface: {
          DEFAULT: "var(--color-on-surface)",
          variant: "var(--color-on-surface-variant)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          container: "var(--color-primary-container)",
        },
        on_primary: "var(--color-on-primary)",
        secondary: {
          DEFAULT: "var(--color-secondary)",
          container: "var(--color-secondary-container)",
        },
        tertiary: "var(--color-tertiary)",
        outline: {
          variant: "var(--color-outline-variant)",
        },
        error: "var(--color-error)",
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
          "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
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
