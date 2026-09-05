import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1a2b4a",
          light: "#26406e",
          dark: "#101c30",
        },
        accent: {
          DEFAULT: "#d4a017",
          light: "#e6bd4a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        devanagari: ["var(--font-noto-devanagari)", "system-ui", "sans-serif"],
        gurmukhi: ["var(--font-noto-gurmukhi)", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-50% - 0.5rem))" },
        },
        "pulse-ring": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.45)" },
          "50%": { boxShadow: "0 0 0 12px rgba(37, 211, 102, 0)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        "pulse-ring": "pulse-ring 2.5s ease-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
