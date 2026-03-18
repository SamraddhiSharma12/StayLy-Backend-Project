/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.{html,ejs.js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
  }
},
  plugins: [
    // Add any plugins you're using here
  ],
}