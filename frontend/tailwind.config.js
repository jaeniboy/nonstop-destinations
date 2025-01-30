/** @type {import('tailwindcss').Config} */
import { colors } from './colors.js';
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: colors,
      fontFamily: {
        'noto-emoji': ['"Noto Emoji"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

