import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        neon: {
          50: "#e6fff4",
          100: "#b3ffe0",
          200: "#80ffcd",
          300: "#4dffb9",
          400: "#1affa6",
          500: "#10ef9c", // Soft vibrant neon green
          600: "#00cc7a",
          700: "#00995c",
          800: "#00663d",
          900: "#00331f",
          950: "#040d09",
        },
        zen: {
          50: "#f0fdf7",
          100: "#dcfaee",
          200: "#bbf4dd",
          300: "#87e9c5",
          400: "#4bd4a5",
          500: "#10ef9c",
          600: "#0fae82",
          700: "#118a6a",
          800: "#126d55",
          900: "#125a47",
          950: "#070c0a",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        border: "hsl(var(--border))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'neon': '0 0 25px rgba(16, 239, 156, 0.45)',
        'neon-lg': '0 0 50px rgba(16, 239, 156, 0.65)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'blur(20px)' },
          '100%': { opacity: '0.9', filter: 'blur(35px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
