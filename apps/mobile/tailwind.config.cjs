/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'viet-green': '#76c034',
        'viet-bg': '#fffbf0',
        'viet-border': '#e8e8e8',
        'viet-text': '#1a1a1a',
        'viet-muted': '#666666',
        'duo-blue': '#1cb0f6',
        'duo-yellow': '#ffc800',
        'lab-bg': '#0a0c10',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
