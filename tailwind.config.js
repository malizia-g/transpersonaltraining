/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,njk,md}",
    "./src/_includes/**/*.njk",
    "./src/scripts/**/*.js"
  ],
  safelist: [
    'bg-science-blue-950/95',
    'backdrop-blur-sm',
    'shadow-lg',
    'bg-transparent',
    'bg-contact-iris-50',
    'bg-contact-iris-600',
    'text-contact-iris-600',
  ],
  theme: {
    extend: {
      colors: {
        // Scientific & Professional Color Palette
        'science-blue': {
          50: '#F0F6FF',
          100: '#E0ECFF',
          200: '#C1DEFF',
          300: '#A2CFFF',
          400: '#6FA8FF',
          500: '#3B82F6',
          600: '#1E40AF',     // Primary brand blue - scientific authority
          700: '#1E3A8A',     // Darker blue for depth
          800: '#1F2937',     // Near-black blue for text
          900: '#0F1419',     // Dark navy
          950: '#030711',
        },
        'warm-yellow': {
          50: '#FFFBF0',
          100: '#FEF3C7',
          200: '#FCD34D',     // Primary CTA yellow - warm, inviting
          300: '#FBB03E',
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
        },
        'accent-teal': {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',     // Secondary accent
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        'neutral-warm': {
          50: '#FFFEF9',      // Lighter warm white
          100: '#FAF8F3',
          200: '#F3EBE0',
          300: '#E5D4C1',
          400: '#D4C5B9',
          500: '#A39E93',
          600: '#8B8680',
          700: '#5D584E',
          800: '#3F3A35',
          900: '#2B2825',
        },
        'contact-iris': {
          50: '#f4f3ff',
          600: '#541e86',     // Contact CTA background - deep purple
        },
        'indigo-deep': {
          50: '#F0F4FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',     // Deep indigo for headings
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
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
