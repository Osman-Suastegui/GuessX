/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        gaming: ["Orbitron", "sans-serif"],
      },
      colors: {
        "gaming-purple": "#8B5CF6",
        "gaming-pink": "#EC4899",
        "gaming-cyan": "#06B6D4",
        "gaming-neon": "#00FFDD",
        "gaming-neon-pink": "#FF2DB6",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
        twinkle: "twinkle 2s infinite",
        "bounce-subtle": "bounce-subtle 2s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
          },
          "50%": {
            transform: "scale(1.05)",
            boxShadow: "0 0 40px rgba(255, 255, 255, 0.5)",
          },
        },
        shimmer: {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        "bounce-subtle": {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-5px)" },
          "60%": { transform: "translateY(-3px)" },
        },
      },
    },
  },
  plugins: [],
};
