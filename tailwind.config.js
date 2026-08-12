/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0B1F3A", light: "#14325C", dark: "#060F1F" },
        gold: { DEFAULT: "#C9A84C", light: "#E5CE8A", dark: "#A6873A" },
        cream: "#FAF8F3",
        ink: "#1A1A1A",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
