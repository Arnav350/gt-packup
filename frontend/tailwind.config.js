/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#b3a369",
      "light-primary": "#ece8da",
      error: "#ff0000",
      black: "#222222",
      "text-gray": "#888888",
      "border-gray": "#d9d9d9",
      "small-gray": "#eeeeee",
      "large-gray": "#f8f8f8",
      white: "#ffffff",
      transparent: "transparent",
    },
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
