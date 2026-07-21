// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F4EE",
        ink: "#1B211C",
        slate: "#5B6259",
        line: "#D8D2C4",
        green: {
          DEFAULT: "#1F4A38",
          800: "#163A2B",
          900: "#102B20",
        },
        brass: {
          DEFAULT: "#A9822F",
          600: "#8C6B24",
        },
        maroon: "#8C3232",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        utility: ["var(--font-space)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;