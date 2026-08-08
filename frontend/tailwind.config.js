/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aerospace: {
          950: '#05070B',
          900: '#0A0F17',
          850: '#0F1726',
          800: '#141E30',
          700: '#1E2C44',
          border: 'rgba(255, 255, 255, 0.07)',
          'border-cyan': 'rgba(0, 243, 255, 0.2)',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00f3ff',
          600: '#0284c7',
        },
        ai: {
          500: '#a855f7',
          600: '#9333ea',
          glow: 'rgba(168, 85, 247, 0.25)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
