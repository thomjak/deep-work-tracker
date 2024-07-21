module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      lineClamp: {
        3: '3',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}