/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A', // Deep Indigo
        accent: '#10B981',  // Emerald
        secondary: '#8B5CF6', // Purple
        'lab-dark': '#0B0F19',
        'lab-card': '#161B22',
        'lab-border': '#30363D',
      },
      fontFamily: {
        'be-vietnam': ['"Be Vietnam Pro"', 'sans-serif'],
        sora: ['"Be Vietnam Pro"', 'sans-serif'], // Map old classes to new font
        inter: ['"Be Vietnam Pro"', 'sans-serif'], // Map old classes to new font
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      gridTemplateColumns: {
        '18': 'repeat(18, minmax(0, 1fr))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
