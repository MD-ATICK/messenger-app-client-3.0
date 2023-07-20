/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '380px',
      md: '764px',
      lg: '1024px',
    }
  },
  plugins: [],
}