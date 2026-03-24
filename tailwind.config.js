import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'var(--calorix-green)',
          foreground: '#ffffff',
          dark: 'var(--calorix-green-dark)',
        },
        accent: {
          DEFAULT: 'var(--calorix-accent)',
          foreground: '#ffffff',
        },
        calorix: {
          bg: 'var(--calorix-bg)',
          text: 'var(--calorix-text)',
          muted: '#64748b',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'calorix-pop': {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'calorix-pop': 'calorix-pop 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      boxShadow: {
        calorix: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 4px 12px -2px rgb(34 197 94 / 0.08)',
        'calorix-lg': '0 8px 30px -8px rgb(15 23 42 / 0.12)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
