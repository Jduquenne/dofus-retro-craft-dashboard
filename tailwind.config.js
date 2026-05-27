/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dofus: {
          bg:           '#8c8368',
          panel:        '#C8B89A',
          'panel-lt':   '#DDD0B8',
          'panel-dk':   '#B0A082',
          border:       '#3A240C',
          'border-md':  '#7A5228',
          orange:       '#CC6000',
          'orange-lt':  '#E07818',
          gold:         '#6B4E00',
          text:         '#1A0E04',
          'text-md':    '#5A3A18',
          'text-lt':    '#9A7858',
          cream:        '#F0E8D8',
          success:      '#4A8A30',
          error:        '#8A2010',
        },
      },
      fontFamily: {
        dofus: ['Cinzel', 'Georgia', 'serif'],
        bit: ['bitMini6', 'monospace'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%':      { transform: 'translateX(-5px)' },
          '30%':      { transform: 'translateX(5px)' },
          '45%':      { transform: 'translateX(-4px)' },
          '60%':      { transform: 'translateX(4px)' },
          '75%':      { transform: 'translateX(-2px)' },
          '90%':      { transform: 'translateX(2px)' },
        },
        popoverIn: {
          '0%':   { opacity: '0', transform: 'translateY(-6px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        shake:      'shake 0.45s ease-in-out',
        'popover-in': 'popoverIn 0.15s ease-out',
      },
    },
  },
  plugins: [],
}
