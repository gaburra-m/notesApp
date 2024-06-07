/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        'notes': 'repeat( auto-fill, minmax(320px, 1fr))'
      }
    },
  },
  plugins: [],
}

