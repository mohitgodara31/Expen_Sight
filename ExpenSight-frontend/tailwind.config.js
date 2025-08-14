// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Set 'Inter' as the default sans-serif font
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#f97316',
        neutral: '#1f2937',
        'base-100': '#ffffff',
      }
    },
  },
  // Add the forms plugin
  plugins: [require('@tailwindcss/forms')],
}