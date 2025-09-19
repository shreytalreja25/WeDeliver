/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        driver: '#7c3aed',
        accident: '#ef4444',
        police: '#f59e0b',
        ambulance: '#22c55e',
        zone: '#2563eb',
      },
    },
  },
  plugins: [],
};
