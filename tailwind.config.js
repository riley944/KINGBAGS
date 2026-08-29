/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        smoke: "#F3F5F2",
        ink: { DEFAULT: "#10140F", soft: "#5C635B" },
        ember: { DEFAULT: "#14532D", dark: "#0C3D20", tint: "#E9F2EC" },
        charcoal: "#101410",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        hero: ["var(--font-hero)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,20,15,0.05), 0 4px 16px rgba(16,20,15,0.05)",
        lift: "0 2px 4px rgba(16,20,15,0.05), 0 18px 40px rgba(16,20,15,0.10)",
      },
      borderRadius: { "2.5xl": "0.875rem", "4xl": "1.125rem" },
    },
  },
  plugins: [],
};
