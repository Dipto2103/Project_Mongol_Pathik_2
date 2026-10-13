/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mars: {
          darkest: '#0b0c10',
          dark: '#14171d',
          surface: '#1c212a',
          card: '#222834',
          border: '#2e3846',
          rust: '#a8422b',
          'rust-dark': '#7a2e1d',
          orange: '#ff6738',
          'orange-bright': '#ff8a5c',
          amber: '#f59e0b',
          sand: '#e0c3a2',
          muted: '#8e9aa8',
          text: '#f1f5f9',
          cyan: '#38bdf8',
          green: '#22c55e',
          red: '#ef4444'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
