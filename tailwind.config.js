/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#001732',
        info: '#5ab7ad',
        danger: '#dc3545',
        warning: '#F0C252',
        success: '#198754',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #19294A, #4078FF, #563620, #FFFFFF)',
      },
      gradientColorStops: theme => ({
        'gradient-start': '#19294A',
        'gradient-middle1': '#4078FF',
        'gradient-middle2': '#563620',
        'gradient-end': '#FFFFFF',
      }),
    },
  },
  plugins: [],
  important: true,
  prefix: 'tw-',
  corePlugins: {
    preflight: false,
  },
};
