import type { Config } from "tailwindcss";

// Using `as any` to allow `safelist` (supported by Tailwind runtime but missing in current type version)
const config: any = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    { pattern: /bg-(background|surface|surfaceStrong|foreground|muted|primary|accent|destructive|borderBase|ring)/ }
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        surfaceStrong: "hsl(var(--surface-strong) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        borderBase: "hsl(var(--border-base) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 8px 24px rgba(2,6,23,0.12), 0 2px 6px rgba(2,6,23,0.06)",
        cardDark: "0 12px 40px rgba(0,0,0,0.6)",
        elevationSm: "0 1px 2px rgba(0,0,0,0.04),0 2px 4px -1px rgba(0,0,0,0.08)",
        elevationMd: "0 2px 4px rgba(0,0,0,0.08),0 8px 24px -6px rgba(0,0,0,0.14)",
        hoverLift: "0 4px 10px -2px rgba(0,0,0,0.10),0 12px 28px -6px rgba(0,0,0,0.12)",
        hoverLiftDark: "0 4px 10px -2px rgba(0,0,0,0.55),0 14px 32px -8px rgba(0,0,0,0.55)",
        depth: "0 4px 8px -2px rgba(0,0,0,0.08),0 8px 20px -4px rgba(0,0,0,0.10)",
        depthLg: "0 8px 16px -4px rgba(0,0,0,0.10),0 16px 40px -8px rgba(0,0,0,0.16)",
        depthXl: "0 12px 24px -6px rgba(0,0,0,0.14),0 28px 64px -12px rgba(0,0,0,0.22)",
        depthGlow: "0 0 0 1px rgba(255,255,255,0.04),0 4px 18px -4px rgba(0,0,0,0.32),0 0 32px -4px hsl(var(--primary)/0.25)",
      }
    },
  },
};

export default config as Config;
