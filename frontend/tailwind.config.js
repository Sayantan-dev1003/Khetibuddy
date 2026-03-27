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
          DEFAULT: '#5d4037', // Sienna Brown
          light: '#8d6e63',
          dark: '#3e2723',
        },
        secondary: {
          DEFAULT: '#8da14e', // Sage Green
          light: '#a4be5c',
        },
        accent: {
          DEFAULT: '#bc6c25', // Terracotta
        },
        harvest: {
          DEFAULT: '#fefae0', // Cream/Bone
          alt: '#f1ede1',
        },
        clay: {
          DEFAULT: '#2d241e',
          muted: '#6d5d54',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Public Sans"', 'sans-serif'],
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      },
      animation: {
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.4s ease-in-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'shake': 'shake 0.3s ease-in-out 3',
      }
    },
  },
  plugins: [],
}
