/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        space: {
          900: '#030510',
          800: '#080B1C',
          700: '#11162C',
          600: '#1A213D',
          500: '#252D4F',
        },
        cyan: {
          DEFAULT: '#00F0FF',
          muted: '#00F0FF33',
        },
        emerald: {
          DEFAULT: '#00FF87',
          muted: '#00FF8733',
        },
        signal: {
          DEFAULT: '#FF3366',
          muted: '#FF336633',
        },
        alert: {
          yellow: '#FFD700',
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, #030510 0%, #080B1C 40%, #11162C 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
        'glass-gradient-highlight': 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'spin-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glass-glow': '0 8px 32px rgba(0, 240, 255, 0.1), inset 0 0 0 1px rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
        lg: '24px',
        xl: '40px',
      },
    },
  },
  plugins: [],
}
