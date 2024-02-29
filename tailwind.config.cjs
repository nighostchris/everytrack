/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crail: {
          50: '#fbf5f1',
          100: '#f5e9df',
          200: '#eacfbe',
          300: '#ddae94',
          400: '#ce8769',
          500: '#c46b4b',
          600: '#b95841',
          700: '#974537',
          800: '#7a3932',
          900: '#63312b',
          950: '#351715',
        },
        finlandia: {
          50: '#f3f6f3',
          100: '#e4e8e3',
          200: '#c9d2c8',
          300: '#a2b3a2',
          400: '#788f79',
          500: '#5b745d',
          600: '#435845',
          700: '#364639',
          800: '#2c392d',
          900: '#252f26',
          950: '#141a15',
        },
        monarch: {
          50: '#fff1f0',
          100: '#ffe3e2',
          200: '#ffcacb',
          300: '#ff9ea1',
          400: '#ff686f',
          500: '#ff3340',
          600: '#ee1029',
          700: '#c90721',
          800: '#a80924',
          900: '#980c28',
          950: '#51000e',
        },
      },
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
      zIndex: {
        60: '60',
      },
      height: {
        100: '400px',
        104: '416px',
        108: '432px',
        112: '448px',
        116: '464px',
        120: '480px',
        124: '496px',
        128: '512px',
        132: '528px',
        136: '544px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
