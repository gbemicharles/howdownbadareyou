/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0b0e',
          card: '#12141c',
          border: '#232736',
          hover: '#1a1d29'
        },
        accent: {
          pink: '#ff2a85',
          purple: '#8b5cf6',
          cyan: '#00f2fe',
          red: '#ff4757',
          green: '#00e676',
          yellow: '#ffd32a'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'radar': 'radar 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(255, 42, 133, 0.4)' },
          '100%': { boxShadow: '0 0 35px rgba(139, 92, 246, 0.7), 0 0 15px rgba(0, 242, 254, 0.5)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
