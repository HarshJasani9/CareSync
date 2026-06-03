/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#1D9E75',
          600: '#0F6E56',
          700: '#047857',
          800: '#065F46',
          900: '#085041',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F4F6F8',
        },
        dark: {
          bg: '#0F1117',
          sidebar: '#141920',
          card: '#1C2333',
          border: '#2A3447',
          text: {
            primary: '#F0F4F8',
            secondary: '#8B9CB5',
            muted: '#4A5568'
          }
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
