/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vp-navy': {
          DEFAULT: '#0F172A',
          light: '#1E293B',
        },
        'vp-cyan': '#0EA5E9',
        'vp-mint': '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

