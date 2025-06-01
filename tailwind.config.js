// tailwind.config.js
module.exports = {
  darkMode: "class", // or 'media'
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f1c",
        card: "rgba(255, 255, 255, 0.05)",
        accent: "#3f87f5",
        neon: "#00f9bb",
        danger: "#ff477e",
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(circle at center, #1e293b, #0f172a)",
        "gradient-glow":
          "radial-gradient(ellipse at center, rgba(63,135,245,0.4), transparent 70%)",
      },
      boxShadow: {
        "card-glow": "0 4px 30px rgba(0, 255, 200, 0.15)",
      },
      borderRadius: {
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
};
