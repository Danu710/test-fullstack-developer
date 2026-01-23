const {heroui} = require('@heroui/theme');

  plugins: [heroui()],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(button|ripple|spinner).js"
  ],