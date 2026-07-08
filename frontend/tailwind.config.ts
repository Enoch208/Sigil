/**
 * @file tailwind.config.ts — Sigil theme: dark/ink/amber palette, Outfit + Lexend
 * fonts, dark-native elevation, fluid type scale, and breakpoints (md 810 / lg 1200).
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    screens: {
      sm: "640px",
      md: "810px",
      lap: "1024px",
      lg: "1200px",
      xl: "1400px",
      "2xl": "1536px",
    },
    extend: {
      fontSize: {
        "fluid-xs": "clamp(0.688rem, 0.66rem + 0.11vw, 0.75rem)",
        "fluid-sm": "clamp(0.813rem, 0.79rem + 0.11vw, 0.875rem)",
        "fluid-base": "clamp(0.938rem, 0.91rem + 0.11vw, 1rem)",
        "fluid-lg": "clamp(1.031rem, 0.99rem + 0.17vw, 1.125rem)",
        "fluid-xl": "clamp(1.125rem, 1.07rem + 0.23vw, 1.25rem)",
        "fluid-2xl": "clamp(1.188rem, 1.11rem + 0.34vw, 1.375rem)",
        "fluid-3xl": "clamp(1.375rem, 1.22rem + 0.68vw, 1.75rem)",
        "fluid-4xl": "clamp(1.625rem, 1.42rem + 0.91vw, 2.125rem)",
      },
      spacing: {
        "fluid-1": "clamp(0.75rem, 0.65rem + 0.45vw, 1rem)",
        "fluid-2": "clamp(1rem, 0.8rem + 0.91vw, 1.5rem)",
        "fluid-3": "clamp(1.25rem, 0.94rem + 1.36vw, 2rem)",
        "fluid-4": "clamp(1.5rem, 0.89rem + 2.73vw, 3rem)",
      },
      colors: {
        page: "var(--bg-page)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        contrast: "var(--bg-contrast)",
        "fg-primary": "var(--fg-primary)",
        "fg-body": "var(--fg-body)",
        "fg-muted": "var(--fg-muted)",
        "fg-hint": "var(--fg-hint)",
        hairline: "var(--border-hairline)",
        strong: "var(--border-strong)",
        accent: "var(--accent-primary)",
        "accent-bg": "var(--accent-bg)",
        "accent-ink": "var(--accent-ink)",
        positive: "var(--accent-positive)",
        "positive-bg": "var(--accent-positive-bg)",
        negative: "var(--accent-negative)",
        "negative-bg": "var(--accent-negative-bg)",
        /* Template brand palette */
        cream: "#0a0a10",
        soft: "#16161f",
        "soft-2": "#101017",
        ink: "#f5f6fb",
        "ink-deep": "#e7e8f0",
        orange: "#f5a524",
        "muted-ink": "#8a8b97",
      },
      fontFamily: {
        display: "var(--font-display)",
        heading: "var(--font-display)",
        body: "var(--font-body)",
        sans: "var(--font-body)",
        mono: "var(--font-mono)",
        desc: "var(--font-desc)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        cta: "var(--shadow-cta)",
        "cta-soft": "var(--shadow-cta-soft)",
        "cta-neutral": "var(--shadow-cta-neutral)",
        "cta-danger": "var(--shadow-cta-danger)",
        dialog: "var(--shadow-dialog)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        seg: {
          "0%, 100%": { backgroundColor: "var(--bg-elevated)" },
          "45%": { backgroundColor: "var(--accent-primary)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "marquee-up": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-50%)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.2s linear infinite",
        seg: "seg 1.5s ease-in-out infinite",
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "marquee-up": "marquee-up 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
