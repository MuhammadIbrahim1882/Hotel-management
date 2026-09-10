/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f6f1',
          100: '#efe5d5',
          500: '#b88a3d',
          700: '#8f6b2f',
          900: '#2a2119',
        },
      },
      boxShadow: {
        soft: '0 20px 50px rgba(30, 32, 44, 0.12)',
      },
    },
  },
  plugins: [],
};
