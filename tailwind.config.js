/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ev: {
          darkest: '#050607',
          dark: '#090A0D',
          card: '#0D0F13',
          cardHover: '#13171D',
          border: '#1B2028',
          borderSubtle: '#14181F',
          borderBright: '#2C3440',
          cyan: '#00F0FF',
          cyanDim: 'rgba(0, 240, 255, 0.15)',
          cyanGlow: 'rgba(0, 240, 255, 0.3)',
          cyanText: '#67E8F9',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
          muted: '#64748B',
          lightMuted: '#94A3B8',
          steel: '#CBD5E1',
          pureWhite: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'Monaco', 'monospace'],
        display: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.2em',
        ultra: '0.3em'
      }
    },
  },
  plugins: [],
}
