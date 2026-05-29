/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Geist', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          orange: '#F47820',
          'orange-light': '#FF9A45',
          'orange-dark': '#D4631A',
          blue: '#1B3A8F',
          'blue-light': '#2E54C4',
          'blue-dark': '#112470',
          'blue-deep': '#0A1845',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0,0,0.2,1) infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
      }
    },
  },
  plugins: [],
}