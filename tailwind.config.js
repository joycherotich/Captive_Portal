export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Geist', 'Inter', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        teal: {
          50:  '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#0D5C56',
          900: '#134E4A',
        },
        slate: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      animation: {
        'fade-in':  'fadeIn  0.45s ease forwards',
        'slide-up': 'slideUp 0.38s ease forwards',
        'float':    'float   6s ease-in-out infinite',
        'spin-slow':'spin    20s linear infinite',
        'ping-slow':'ping    2.5s cubic-bezier(0,0,0.2,1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                         to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0px)' },  '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}