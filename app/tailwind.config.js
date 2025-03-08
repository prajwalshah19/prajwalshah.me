// tailwind.config.js
module.exports = {
    darkMode: 'class', // Enables dark mode via a CSS class
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: "#004225",   // British Racing Green
          accent: "#FFD700",    // Golden Yellow
          secondary: "#ffffff", // White
          dark: "#000000",      // Black
        },
        fontFamily: {
          headline: ['Oswald', 'sans-serif'], // Brutalist, bold headline font
          body: ['Roboto', 'sans-serif'],       // Clean, modern body text
          mono: ['Space Mono', 'monospace'],      // For code snippets or technical sections
        },
      },
    },
    plugins: [],
  };
  