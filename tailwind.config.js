/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bone: "#FAF7F2",
        sand: "#F1EBE1",
        ink: { DEFAULT: "#1C1917", soft: "#57534E" },
        clay: { DEFAULT: "#D95D39", dark: "#B8482A", light: "#F0805C", tint: "#FBEDE7" },
        moss: "#8A9B8E",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 20px rgba(28,25,23,0.05)",
        lift: "0 16px 48px rgba(28,25,23,0.10)",
      },
      borderRadius: {
        "2.5xl": "1.25rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
