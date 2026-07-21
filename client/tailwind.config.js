/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07111f',
        panel: 'rgba(15, 23, 42, 0.75)',
        line: 'rgba(148, 163, 184, 0.2)',
        aqua: '#4fd1c5',
        sky: '#7dd3fc',
        sun: '#fbbf24',
        ember: '#fb7185'
      },
      boxShadow: {
        glow: '0 20px 60px rgba(15, 23, 42, 0.35)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(79, 209, 197, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(125, 211, 252, 0.16), transparent 24%), linear-gradient(180deg, #07111f 0%, #0f172a 100%)'
      }
    }
  },
  plugins: []
};
