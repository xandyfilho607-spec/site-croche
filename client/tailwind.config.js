/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F5EFEB',
          200: '#EFE7DF',
          300: '#E4D8CB',
          400: '#D5C4B1',
          500: '#C2AC96',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E6ECE5',
          200: '#CFDBCB',
          300: '#B0C2AB',
          400: '#8FA689',
          500: '#738C6D',
          600: '#5A7054',
          700: '#465642',
        },
        earth: {
          50: '#F9F6F4',
          100: '#F1E9E4',
          200: '#E2D1C8',
          300: '#CEB2A4',
          400: '#B48F7E',
          500: '#99705E',
          600: '#7E5646',
          700: '#644235',
          800: '#4F3329',
          900: '#3D271F',
        },
        gold: {
          300: '#E8D48E',
          400: '#DEC267',
          500: '#CFAC3F',
          600: '#B5912B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(90, 63, 51, 0.06), 0 2px 6px -1px rgba(90, 63, 51, 0.04)',
        'card': '0 10px 30px -4px rgba(90, 63, 51, 0.08), 0 4px 12px -2px rgba(90, 63, 51, 0.03)',
        'elevated': '0 20px 40px -8px rgba(90, 63, 51, 0.12), 0 8px 16px -4px rgba(90, 63, 51, 0.06)',
      },
    },
  },
  plugins: [],
};
