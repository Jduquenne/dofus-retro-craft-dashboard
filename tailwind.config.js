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
      },
    },
  },
  plugins: [],
}
