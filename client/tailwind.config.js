module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'header-purple': '#f7f0fc',
        'body-purple': '#edd4ff'
      },
    },
  },
  plugins: [require("daisyui")],
}
