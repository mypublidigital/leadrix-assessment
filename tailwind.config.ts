import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — deep navy + warm gold + clean neutrals
        brand: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d5fe",
          300: "#a4b9fc",
          400: "#8093f8",
          500: "#6370f1",
          600: "#4e52e5",
          700: "#3f3fca",
          800: "#3436a3",
          900: "#2e3181",
          950: "#1c1d4d",
        },
        gold: {
          50: "#fefce8",
          100: "#fdf9c4",
          200: "#faf08c",
          300: "#f5e14a",
          400: "#efce1a",
          500: "#dfb30d",
          600: "#c08a08",
          700: "#9a640b",
          800: "#7e4f11",
          900: "#6a4114",
          950: "#3d2206",
        },
        neutral: {
          50: "#f8f8f8",
          100: "#f0f0f0",
          200: "#e4e4e4",
          300: "#d0d0d0",
          400: "#a0a0a0",
          500: "#737373",
          600: "#525252",
          700: "#3d3d3d",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "progress-fill": "progressFill 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        progressFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-md":
          "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.07)",
        "card-lg":
          "0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.07)",
      },
    },
  },
  plugins: [forms],
};

export default config;
