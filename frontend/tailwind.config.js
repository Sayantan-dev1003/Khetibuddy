/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2d5016',
          light: '#3d6b1f',
          dark: '#1d3010',
        },
        accent: {
          green: '#10b981',
          yellow: '#f59e0b',
          blue: '#3b82f6',
        }
      },
      fontSize: {
        'farmer': '18px',
        'farmer-lg': '1.2rem',
        'farmer-xl': '1.5rem',
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 40s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
