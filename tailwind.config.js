/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        smoke: "#F5F5F5",
        ink: { DEFAULT: "#111111", soft: "#6A6A6A" },
        ember: { DEFAULT: "#111111", dark: "#000000", tint: "#EFEFEF" },
        charcoal: "#121212",
        gold: { DEFAULT: "#6B6B6B", deep: "#444444", tint: "#F4F4F4" },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        hero: ["var(--font-display)", "Georgia", "serif"],
        grotesk: ["var(--font-grotesk)", "var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,17,17,0.05), 0 4px 16px rgba(17,17,17,0.05)",
        lift: "0 2px 4px rgba(17,17,17,0.05), 0 18px 40px rgba(17,17,17,0.10)",
      },
      borderRadius: { "2.5xl": "0.875rem", "4xl": "1.125rem" },
    },
  },
  plugins: [],
};
