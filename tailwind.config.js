/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bone: "#F7F5F0",
        sand: "#EDE9E0",
        ink: { DEFAULT: "#191817", soft: "#5C5955" },
        forest: { DEFAULT: "#1E3A2F", light: "#2C5243", tint: "#E8EFEA" },
        brass: "#9C8A5A",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Satoshi", "DM Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 20px rgba(25,24,23,0.05)",
        lift: "0 16px 48px rgba(25,24,23,0.10)",
      },
      borderRadius: { "2.5xl": "1.25rem", "4xl": "2rem" },
    },
  },
  plugins: [],
};
