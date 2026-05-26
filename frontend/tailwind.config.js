/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        amazon: {
          dark:   '#0F1111',
          navy:   '#232F3E',
          orange: '#FF9900',
          yellow: '#FFD814',
          blue:   '#007185',
          red:    '#CC0C39',
          grey:   '#EAEDED',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'amazon': '0 2px 5px rgba(15,17,17,.15)',
        'amazon-hover': '0 0 0 2px #E77600',
      },
    },
  },
  plugins: [],
};
