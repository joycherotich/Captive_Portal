/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    // ─── Override default screens for precise breakpoints ───────────────────
    screens: {
      xs: "375px",   // Small phones (iPhone SE, Galaxy A)
      sm: "640px",   // Large phones / small tablets
      md: "768px",   // Tablets (iPad portrait)
      lg: "1024px",  // Tablets landscape / small laptops
      xl: "1280px",  // Desktops
      "2xl": "1536px", // Wide desktops / 4K
    },

    extend: {
      // ─── Fonts ─────────────────────────────────────────────────────────────
      fontFamily: {
        display: ["Geist", "Inter", "sans-serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
        mono:    ["Geist Mono", "JetBrains Mono", "monospace"],
      },

      // ─── Responsive font sizes ─────────────────────────────────────────────
      // Use fluid-friendly size tokens you can reference like: text-fluid-lg
      fontSize: {
        "fluid-xs": ["clamp(0.75rem,  1.5vw,  0.875rem)", { lineHeight: "1.5" }],
        "fluid-sm": ["clamp(0.875rem, 1.8vw,  1rem)",     { lineHeight: "1.6" }],
        "fluid-md": ["clamp(1rem,     2vw,    1.125rem)",  { lineHeight: "1.7" }],
        "fluid-lg": ["clamp(1.125rem, 2.5vw,  1.5rem)",   { lineHeight: "1.5" }],
        "fluid-xl": ["clamp(1.5rem,   4vw,    2.25rem)",  { lineHeight: "1.3" }],
        "fluid-2xl":["clamp(2rem,     5vw,    3.5rem)",   { lineHeight: "1.15" }],
        "fluid-3xl":["clamp(2.5rem,   7vw,    5rem)",     { lineHeight: "1.1" }],
      },

      // ─── Responsive spacing ────────────────────────────────────────────────
      // Use these for section padding, gaps, etc.
      spacing: {
        "safe-top":    "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left":   "env(safe-area-inset-left)",
        "safe-right":  "env(safe-area-inset-right)",
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
        "30":  "7.5rem",
        "34":  "8.5rem",
        "128": "32rem",
        "144": "36rem",
      },

      // ─── Fluid container widths ─────────────────────────────────────────────
      maxWidth: {
        "content":  "65ch",     // Readable line length for prose
        "reading":  "72ch",
        "screen-xs":"375px",
        "screen-sm":"640px",
        "screen-md":"768px",
        "screen-lg":"1024px",
        "screen-xl":"1280px",
        "screen-2xl":"1536px",
      },

      // ─── Colors ─────────────────────────────────────────────────────────────
      colors: {
        teal: {
          50:  "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#0D5C56",
          900: "#134E4A",
        },
        slate: {
          50:  "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
      },

      // ─── Animations ─────────────────────────────────────────────────────────
      animation: {
        "fade-in":  "fadeIn  0.45s ease forwards",
        "slide-up": "slideUp 0.38s ease forwards",
        "float":    "float   6s ease-in-out infinite",
        "spin-slow":"spin    20s linear infinite",
        "ping-slow":"ping    2.5s cubic-bezier(0,0,0.2,1) infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                                to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        float:   { "0%,100%": { transform: "translateY(0px)" },         "50%": { transform: "translateY(-10px)" } },
      },

      // ─── Aspect ratios ──────────────────────────────────────────────────────
      aspectRatio: {
        "4/3":    "4 / 3",
        "3/2":    "3 / 2",
        "2/1":    "2 / 1",
        "9/16":   "9 / 16",   // Vertical / portrait (mobile video)
        "21/9":   "21 / 9",   // Ultrawide
      },
    },
  },

  plugins: [],
}