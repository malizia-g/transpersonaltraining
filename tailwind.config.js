/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,njk,md}",
    "./src/_includes/**/*.njk",
    "./src/scripts/**/*.js"
  ],
  // Applied at runtime by src/scripts/modules/navigation.js, so the scanner
  // never sees them in the markup.
  safelist: [
    'py-1.5',
    'py-6',
    'backdrop-blur-sm',
    'shadow-lg',
    'bg-transparent',
  ],
  theme: {
    extend: {
      // Colour is not declared here. Every colour on the site resolves through
      // the palette tokens at the top of src/styles/main.css — see the
      // "Colour palette" comment there — so the old named scales
      // (science-blue, warm-yellow, neutral-warm, …) have been removed rather
      // than left to drift alongside them.
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [],
}
