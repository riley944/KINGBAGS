/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBFAF7",
        smoke: "#F2F0EB",
        ink: { DEFAULT: "#2A2825", soft: "#6B6862" },
        royal: { DEFAULT: "#2D62E8", dark: "#1F4BC4", tint: "#EDF2FE" },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 16px rgba(42,40,37,0.06)",
        lift: "0 16px 44px rgba(42,40,37,0.10)",
      },
      borderRadius: { "2.5xl": "1.25rem", "4xl": "2rem" },
    },
  },
  plugins: [],
};
