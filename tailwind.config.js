/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#424242',
      },
      boxShadow: {
        glow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)', // Glow shadow,
        lightglow: '0 0 5px rgba(255, 255, 255, 0.3), 0 0 10px rgba(255, 255, 255, 0.2)', // Subtle glow shadow
        boxshadow: '0 0 10px rgba(92, 47, 197, 0.7)',
        custom: '8px 8px 15px rgba(0, 0, 0, 0.75)',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], 
        protest: ['"Protest Guerrilla"', 'sans-serif'],
        monte: ['"Montserrat"', 'sans-serif'],
        poppins:[ '"Poppins"', 'sans-serif'],
        greek:[ '"Space Grotesk"', 'sans-serif']
      },
      fontWeight: {
        medium: 500, 
        100: 100,
        300: 300,
        400: 400,
        500: 500,
        600: 600,
        700: 700,
        800: 800,
        900: 900,// Custom weight for medium
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Custom animated gradient
        'moving-gradient': 'radial-gradient(circle, rgba(119, 61, 255, 1) 0%, rgba(0, 0, 0, 1) 100%)',
      },
      keyframes: {
        "gradient-move": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        // New keyframes for the animated background
        "background-move": {
          "0%": {
            backgroundPosition: "0% 0%",
          },
          "50%": {
            backgroundPosition: "100% 100%",
          },
          "100%": {
            backgroundPosition: "0% 0%",
          },
        },
        "moveGradient": {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        oneMove: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-10px, -10px)' },
          '50%': { transform: 'translate(10px, 10px)' },
          '75%': { transform: 'translate(-10px, 10px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        twoMove: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(15px, -15px)' },
          '50%': { transform: 'translate(-15px, 15px)' },
          '75%': { transform: 'translate(15px, 15px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        threeMove: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-5px, 5px)' },
          '50%': { transform: 'translate(5px, -5px)' },
          '75%': { transform: 'translate(-5px, -5px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        fourMove: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(20px, 20px)' },
          '50%': { transform: 'translate(-20px, -20px)' },
          '75%': { transform: 'translate(20px, -20px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        fiveMove: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-15px, -15px)' },
          '50%': { transform: 'translate(15px, 15px)' },
          '75%': { transform: 'translate(-15px, 15px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        sixMove: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, 0)' },
          '50%': { transform: 'translate(-10px, 0)' },
          '75%': { transform: 'translate(10px, 10px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
      animation: {
        "gradient-move": "gradient-move 8s ease-in-out infinite",
        // New animation for the background
        "background-move": "background-move 10s ease-in-out infinite",
        moveGradient: 'moveGradient 15s infinite',
        oneMove: 'oneMove 3.5s infinite',
        twoMove: 'twoMove 4s infinite',
        threeMove: 'threeMove 4.5s infinite',
        fourMove: 'fourMove 5s infinite',
        fiveMove: 'fiveMove 5.5s infinite',
        sixMove: 'sixMove 6s infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
