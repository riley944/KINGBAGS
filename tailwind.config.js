/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        smoke: "#F4F4F2",
        ink: { DEFAULT: "#111110", soft: "#444442" },
        cobalt: { DEFAULT: "#2244DD", dark: "#1A35B0", tint: "#EEF1FE" },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 16px rgba(17,17,16,0.07)",
        lift: "0 16px 48px rgba(17,17,16,0.12)",
      },
      borderRadius: { "2.5xl": "1.25rem", "4xl": "2rem" },
    },
  },
  plugins: [],
};
