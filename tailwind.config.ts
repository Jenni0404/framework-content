import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F8F4EF",
        ink: "#1A1A1A",
        sage: {
          50: "#F1F4EE",
          100: "#E4DED3",
          300: "#A89C8E",
          600: "#2D6A4F",
          700: "#2D6A4F",
          800: "#24573F",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
