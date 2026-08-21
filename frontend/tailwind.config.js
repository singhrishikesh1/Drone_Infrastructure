/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: '#FDF2F8',
        cardBg: '#FFFFFF',
        innerBg: '#FCE7F3',
        primaryAccent: '#E11D48',
        btnPrimary: '#E11D48',
        successGreen: '#16A34A',
        warningOrange: '#D97706',
        criticalRed: '#E11D48',
        textMain: '#831843',
        textSecondary: '#9D174D',
        textMuted: '#BE185D',
        pinkTheme: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F472B6',
          400: '#E11D48',
          500: '#BE123C',
          900: '#831843',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


