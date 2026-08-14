/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        smoke: "#F1F1ED",
        ink: { DEFAULT: "#1D1C1A", soft: "#52504C" },
        cobalt: { DEFAULT: "#0A6CFF", dark: "#0554D6", tint: "#EAF2FF" },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 16px rgba(29,28,26,0.06)",
        lift: "0 16px 48px rgba(29,28,26,0.10)",
      },
      borderRadius: { "2.5xl": "1.25rem", "4xl": "2rem" },
    },
  },
  plugins: [],
};
