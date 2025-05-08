/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        southwest: {
          blue: {
            DEFAULT: '#304CB2',
            dark: '#1a2a66',
            light: '#5C75D9',
          },
          red: {
            DEFAULT: '#E31837',
            dark: '#A30F27',
            light: '#F04C62',
          },
          yellow: {
            DEFAULT: '#FFBF27',
            dark: '#F5B120',
            light: '#FFDA7F',
          },
        },
      },
      animation: {
        'wave': 'wave 8s ease-in-out infinite',
        'wave-slow': 'wave 10s ease-in-out -2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-down': 'slideDown 0.5s ease-in-out',
        'slide-left': 'slideLeft 0.5s ease-in-out',
        'slide-right': 'slideRight 0.5s ease-in-out',
        'reveal-text': 'revealText 1.2s cubic-bezier(.77,0,.175,1)',
        'morph': 'morph 8s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateX(-50%)' },
          '50%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-subtle': {
          '0%, 100%': {
            transform: 'translateY(-2%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        revealText: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '30%': { transform: 'scaleX(1)', transformOrigin: 'left' },
          '60%': { transform: 'scaleX(1)', transformOrigin: 'right' },
          '100%': { transform: 'scaleX(0)', transformOrigin: 'right' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 40% 30% 70% 60%' },
          '75%': { borderRadius: '40% 60% 70% 40% / 60% 30% 70% 30%' },
        },
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'width': 'width',
        'border': 'border-width, border-color',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.5, 0, 0.75, 0)',
        'bounce-out': 'cubic-bezier(0.5, 0, 0.75, 1.5)',
        'smooth-slow': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '80ch',
            h1: {
              color: '#304CB2',
            },
            h2: {
              color: '#304CB2',
            },
            h3: {
              color: '#304CB2',
            },
            strong: {
              color: '#304CB2',
            },
            a: {
              color: '#E31837',
              '&:hover': {
                color: '#A30F27',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
} 