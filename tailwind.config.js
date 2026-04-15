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
        'rubik': ['"Rubik"', 'sans-serif'], // New display font
        sora: ['"Be Vietnam Pro"', 'sans-serif'],
        inter: ['"Be Vietnam Pro"', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      gridTemplateColumns: {
        '18': 'repeat(18, minmax(0, 1fr))',
        'bento': 'repeat(auto-fit, minmax(280px, 1fr))', // Fluid grid
      },
      boxShadow: {
        'tactile': '4px 4px 0px 0px rgba(0,0,0,1)', // Hard gamified shadow
        'tactile-hover': '2px 2px 0px 0px rgba(0,0,0,1)', // Pressed state
        'tactile-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'tactile-green': '4px 4px 0px 0px #1a1a1a', 
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
