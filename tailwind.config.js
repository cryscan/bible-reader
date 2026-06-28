/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fbf7ef',
          100: '#f5ecd9',
          200: '#e8d9b8',
        },
        ink: {
          DEFAULT: '#2c2418',
          light: '#5c5040',
        },
        accent: {
          DEFAULT: '#8b5e3c',
          dark: '#6b4423',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
