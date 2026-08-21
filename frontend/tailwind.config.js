/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: '#08111A',
        cardBg: '#101C28',
        innerBg: '#152535',
        primaryAccent: '#16B9E8',
        btnPrimary: '#16B9E8',
        successGreen: '#22C55E',
        warningOrange: '#F59E0B',
        criticalRed: '#EF4444',
        textMain: '#F1F5F9',
        textSecondary: '#94A3B8',
        textMuted: '#64748B',
        aerospace: {
          950: '#08111A',
          900: '#101C28',
          850: '#152535',
          800: '#1A2D40',
          700: '#223A52',
          border: '#152535',
          'border-cyan': 'rgba(22, 185, 232, 0.3)',
        },
        cyan: {
          300: '#7CDCF6',
          400: '#38CBF3',
          500: '#16B9E8',
          600: '#0E94BD',
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

