import type { Config } from "tailwindcss"
import defaultColors from "tailwindcss/colors"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F6CF45",
          hover: "#E5BE34",
          foreground: "#000000",
        },
        // App palette, aligned with the landing page: near-black canvas, layered dark surfaces
        page: "#050505",
        surface: {
          DEFAULT: "#0e0e0e",
          2: "#181818",
          3: "#242424",
        },
        line: "#222222",
        ink: "#050505",
        // the orange from the logo; the rest of Tailwind's amber scale stays available
        amber: { ...defaultColors.amber, DEFAULT: "#FFAE3F" },
        muted: "#B4B4B4",
        subtle: "#8f8f8f",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "floor-scroll": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "0 64px" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "floor-scroll": "floor-scroll 2.4s linear infinite",
        blink: "blink 1.1s step-end infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('tailwind-scrollbar'),
  ],
} satisfies Config

export default config