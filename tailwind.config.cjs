/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'dialog-overlay': 'dialog-overlay 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'dialog-content': 'dialog-content 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'dialog-overlay': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'dialog-content': {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
