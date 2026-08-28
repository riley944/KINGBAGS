/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF8F4",
        smoke: "#F0EDE7",
        ink: { DEFAULT: "#211F1C", soft: "#6E6A63" },
        ember: { DEFAULT: "#D9561F", dark: "#B03F10", tint: "#FBEDE4" },
        charcoal: "#171614",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 16px rgba(33,31,28,0.06)",
        lift: "0 18px 44px rgba(33,31,28,0.11)",
      },
      borderRadius: { "2.5xl": "1.25rem", "4xl": "2rem" },
    },
  },
  plugins: [],
};
