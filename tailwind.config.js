const colors = require("tailwindcss/colors")

/* eslint-env node */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  variants: {
    extend: {
      backgroundColor: ["active", "responsive", "disabled", "dark", "group-hover", "focus-within", "hover", "focus"],
      boxShadow: ["dark", "responsive", "group-hover", "focus-within", "hover", "focus"],
      cursor: ["responsive", "disabled"],
      divideColor: ["responsive", "dark"],
      opacity: ["responsive", "group-hover", "focus-within", "hover", "focus", "disabled"],
      scale: ["responsive", "hover", "focus"],
      textColor: ["responsive", "dark", "group-hover", "focus-within", "hover", "focus", "disabled"],
    },
  },
  theme: {
    extend: {
      colors: {
        brand: colors.violet,
      },
    },
  },
  plugins: [],
}
