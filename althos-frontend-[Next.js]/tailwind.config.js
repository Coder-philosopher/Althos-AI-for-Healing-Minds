
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
     
      colors: {
        bg: '#F6F8FB',
        surface: '#FFFFFF',
        text: {
          primary: '#0F172A',
          secondary: '#475569'
        },
        brand: {
          DEFAULT: '#4F8DFB',
          strong: '#2E5BFF'
        },
        info: '#93C5FD',
        success: '#86EFAC',
        warning: '#FDE68A',
        calm: '#C4B5FD',
        danger: '#FCA5A5',
        border: '#E2E8F0'
      },
      borderRadius: {
        lg: '20px',
        xl: '24px',
        pill: '999px'
      },
      boxShadow: {
        1: '0 1px 2px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.04)',
        2: '0 2px 6px rgba(15,23,42,.08), 0 12px 32px rgba(15,23,42,.06)'
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        }
      }
    },
  },
  plugins: [],
}
