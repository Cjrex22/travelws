/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            brand: {
                navy: '#0a0f1a',
                card: '#111827',
                accent: '#00D4C8',
                orange: '#FF6B35',
            }
        },
        keyframes: {
            shimmer: {
                '100%': { transform: 'translateX(100%)' }
            }
        }
      },
    },
    plugins: [],
  }
