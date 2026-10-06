/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#13131a',
        'surface-light': '#1c1c26',
        primary: '#6366f1',
        'primary-hover': '#4f46e5',
        accent: '#8b5cf6',
      },
    },
  },
  plugins: [],
}
