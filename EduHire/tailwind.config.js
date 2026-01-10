/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          green: '#2C5F34',
          gold: '#FFD700',
          light: '#6AAE7A',
          dark: '#1a3b20',
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      boxShadow: {
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px rgba(44, 95, 52, 0.3)',
        'glass': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'glass-hover': '0 8px 30px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xl-2': '1rem'
      },
    },
  },
  plugins: [],
};
