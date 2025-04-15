/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#1B1B18",
        "charcoal-light": "#2A2A26",
        "silver-light": "#F5F1E6",
        "silver-dark": "#C2BCB0",
        "chalk-red": "#C24032",
        "chalk-red-dark": "#8E2A20",
        gold: "#D4B483",
      },
      backgroundImage: {
        "radial-silver": "radial-gradient(circle at 50% 50%, rgba(245,241,230,0.9) 0%, rgba(245,241,230,0.2) 60%, transparent 100%)",
      },
      fontFamily: {
        custom: ['BodegaChalk', 'sans-serif'],
        header: ['BodegaChalk', 'sans-serif'],
        body: ['BodegaChalkSub', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  safelist: ["bg-charcoal", "text-silver-light"],
  plugins: [],
};
