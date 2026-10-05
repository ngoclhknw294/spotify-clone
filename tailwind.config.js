/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          black: '#121212',
          dark: '#181818',
          lightdark: '#282828',
          light: '#282828',
          grey: '#b3b3b3',
        }
      }
    },
  },
  plugins: [],
}