/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: '#0B0F19',
        glasscard: 'rgba(17, 24, 39, 0.7)',
        accentblue: '#3B82F6',
        accentcyan: '#06B6D4',
        accentred: '#EF4444'
      }
    },
  },
  plugins: [],
}