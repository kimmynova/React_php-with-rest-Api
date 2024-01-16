/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}",
    "./node_modules/tw-elements/dist/js/**/*.js"

  ],
  darkMode: 'class',

  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
}

