/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}","./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      // cursor: {
      //   'fancy': 'url(./src/pages/img/1.gif), pointer',
      // },
      fontFamily: {
        Montserrat: "Trebuchet"
        

      },
    },
  },

  plugins: [require("tailwind-scrollbar","flowbite/plugin")],
  corePlugins: {
    // ...
    verticalAlign: true,
  }
  
};
