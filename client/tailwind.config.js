/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: "#BD40AA",
        },
        gray: {
          DEFAULT: "#AAAAAA",
        },
        red: {
          DEFAULT: "#FF7A83",
        },
        green: {
          DEFAULT: "#16CD8F",
        },
        blue: {
          DEFAULT: "#12D0E3",
        },
        yellow: {
          DEFAULT: "#FCB401",
        },
      },
      boxShadow: {
        DEFAULT: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        2: "0px 4px 30px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
