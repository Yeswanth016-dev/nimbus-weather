/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Named "instrument panel" palette — deep atmosphere navy with
        // amber (sun) and cyan (data/readout) accents.
        atmosphere: {
          950: '#070B14',
          900: '#0B1220',
          800: '#111A2E',
          700: '#1A2740',
          600: '#26365A',
        },
        mist: {
          50: '#F7F9FC',
          100: '#EEF2F8',
          200: '#DCE4F0',
        },
        amber: {
          400: '#F2A93B',
          500: '#E4922A',
        },
        cyan: {
          400: '#5EC8D8',
          500: '#3FA9BB',
        },
        coral: {
          400: '#E8724C',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 20px 60px -20px rgba(7, 11, 20, 0.45)',
        glow: '0 0 40px -10px rgba(242, 169, 59, 0.35)',
      },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
};
