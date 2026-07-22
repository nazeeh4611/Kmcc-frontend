import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F4EE",
        ink: "#1B211C",
        slate: "#5B6259",
        line: "#D8D2C4",
        background: "#F7F4EE",
        foreground: "#1B211C",
        surface: "#F7F4EE",
        border: "#E4DFD3",
        primary: "#1F4A38",
        "muted-foreground": "#5B6259",
        green: {
          DEFAULT: "#1F4A38",
          50: "#EAF1EC",
          100: "#D3E3D9",
          700: "#1B4332",
          800: "#163A2B",
          900: "#102B20",
        },
        brass: {
          DEFAULT: "#A9822F",
          100: "#F3E9D2",
          600: "#8C6B24",
        },
        maroon: {
          DEFAULT: "#8C3232",
          100: "#F3DEDE",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        utility: ["var(--font-space)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        "card-lg": "0 6px 20px rgba(16,24,40,0.08), 0 12px 40px rgba(16,24,40,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
