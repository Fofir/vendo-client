module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "vendo-primary": "#cf30ff",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
