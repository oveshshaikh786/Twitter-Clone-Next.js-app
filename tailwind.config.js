/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        twitterWhite: "#e7e9ea",
        twitterBlue: "#308CD8",
        twitterBorder: "#2f3336",
        twitterLightGrey: "#71767b",
        twitterDarkGrey: "#17181C",
      },
    },
  },
  plugins: [],
};
