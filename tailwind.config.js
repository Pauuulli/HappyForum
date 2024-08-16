/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./presets/**/*.{js,vue,ts}",
  ],
  theme: {
    extend: {
      colors: {
        male: "#2574A9",
        female: "#CF000F",
        secondary: "#AAAAAA",
      },
    },
  },
  plugins: [require("tailwindcss-primeui")],
  darkMode: ["selector", '[class*="p-dark"]'],
};
