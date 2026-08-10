import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        luxury: {
          50: "#FAF9F6",
          100: "#F4F1EA",
          200: "#E8E2D5",
          300: "#D6C7AF",
          400: "#C4AC86",
          500: "#B89B6C",
          600: "#A38253",
          700: "#866840",
          800: "#6B5133",
          900: "#4D3A24",
          gold: "#D4AF37",
          goldLight: "#F3E5AB",
          obsidian: "#0A0A0B",
          charcoal: "#141417",
          cardDark: "#18181B",
          cardLight: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        luxury: "0 20px 50px rgba(0, 0, 0, 0.04), 0 5px 15px rgba(0, 0, 0, 0.02)",
        luxuryHover: "0 30px 60px rgba(0, 0, 0, 0.08), 0 10px 25px rgba(0, 0, 0, 0.04)",
        glow: "0 0 25px rgba(212, 175, 55, 0.25)",
        darkCard: "0 10px 30px rgba(0,0,0,0.5)",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          'from': { backgroundPosition: '0 0' },
          'to': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
