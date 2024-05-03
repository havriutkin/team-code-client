import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#181A1F',
        'custom-blue': '#3146FF',
        'custom-light-gray': '#373E49',
        'custom-dark-gray' : '#272C34',
        'custom-green': '#41CD65',
        'custom-gold': '#F3CC31',
      },
    },
  },
  plugins: [
    tailwindScrollbar
  ],
}

