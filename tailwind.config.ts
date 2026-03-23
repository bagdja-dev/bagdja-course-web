import type { Config } from "tailwindcss";

export default {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        xl: "1120px"
      }
    },
    extend: {
      colors: {
        bg0: "var(--bg-0)",
        bg1: "var(--bg-1)",
        surface: "var(--surface)",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
        brand: "var(--brand)",
        brand2: "var(--brand-2)"
      },
      boxShadow: {
        glow: "0 0 80px rgba(92, 127, 166, 0.18)",
        warm: "0 0 120px rgba(242, 178, 74, 0.18)"
      }
    }
  },
  plugins: []
} satisfies Config;

