/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: '#a21caf',
        indigo: '#4f46e5',
        royalBlue: '#1d4ed8',
        aquamarine: '#22d3ee',
        darkGreen: '#15803d',
        lightGreen: '#a3e635',
        honeyYellow: '#facc15',
        darkOrange: '#ea580c',
        orangeRed: '#ff4500',
        red: '#dc2626'
      }
    }
  }
}