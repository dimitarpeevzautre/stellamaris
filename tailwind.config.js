/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './utils/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'stella-blue': '#1e3a8a',
        'stella-gold': '#d4af37',
        // Gold for text and meaningful icons on light backgrounds: 4.84:1 on stella-cream, 5.19:1 on white
        // (WCAG AA). Keep stella-gold for fills, decoration and text on dark backgrounds.
        'stella-gold-dark': '#86691a',
        'stella-cream': '#f9f7f2',
        'stella-sand': '#e5ddd0',
        'stella-dark': '#2c2c2c',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
