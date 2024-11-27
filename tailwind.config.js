/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
    colors: {
      white: '#FFFFFF',
      stroke: 'rgba(0, 0, 0, 0.1)',
      offwhite: '#FAFAFA',
      black: '#000000',
      green: '#00703A'
    },
    fontSize: {
      xs: ['12px', {lineHeight: '0.9375rem', letterSpacing: '-0.03125rem'}],
      sm: ['14px', {lineHeight: '0.9375rem', letterSpacing: '-0.03125rem'}],
      lg: ['24px', {lineHeight: '0.9375rem', letterSpacing: '-0.03125rem'}],
      xl: ['40px', {lineHeight: '0.9375rem', letterSpacing: '-0.03125rem'}]
    },
    fontFamily: {
      sfpro: ''
    }
  },
  plugins: [],
}

