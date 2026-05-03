/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          200: '#c1c1ff',
          300: '#a1a2ff',
          400: '#8283ff',
          500: '#6264ff',
          600: '#4246d9',
          700: '#191970', // Midnight Blue
          800: '#141256',
          900: '#0f0e38',
        },
        accent: {
          light: '#EFDFBB', // Pearl Beige
          dark: '#801818',   // Dark Wine
        },
        surface: {
          light: '#EFDFBB',  // Pearl Beige
          dark: '#242124',   // Shadow Grey
          muted: '#808080',  // Grey
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      borderColor: {
        DEFAULT: '#e5e7eb',
        subtle: 'rgba(128, 128, 128, 0.2)',
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        'section': '4rem',
      },
    },
  },
  plugins: [],
}
