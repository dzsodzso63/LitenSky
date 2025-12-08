/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'from-indigo-900',
    'via-purple-900',
    'to-indigo-900',
    'from-orange-300',
    'via-pink-400',
    'to-yellow-300',
    'from-blue-400',
    'via-cyan-300',
    'to-blue-500',
    'from-orange-500',
    'via-pink-500',
    'to-purple-600',
  ],
}

