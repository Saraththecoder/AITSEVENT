/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'carbon-black': '#0A0A0C',
        'charcoal-panel': '#151519',
        'racing-red': '#E10600',
        'pit-teal': '#00D2BE',
        'paddock-amber': '#F5A623',
        'off-white': '#F5F5F7',
        'signal-grey': '#8A8A93',
      },
      fontFamily: {
        display: ['Chakra Petch', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        data: ['IBM Plex Mono', 'monospace'],
      },
      screens: {
        'xs': '480px',
      }
    },
  },
  plugins: [],
}
