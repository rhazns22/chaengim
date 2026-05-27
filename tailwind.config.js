/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B7CFA",
        primaryDark: "#4968E8",
        textMain: "#33384A",
        textSub: "#8A8F9E",
        textMuted: "#9CA3AF",
        background: "#F7F8FC",
        divider: "#EEF1F7",
        chipBg: "#EEF3FF",
        navInactive: "#9CA3AF",
        danger: "#EF4444",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'float': '0 -4px 20px rgba(0, 0, 0, 0.05)',
        'nav': '0 -8px 30px rgba(91, 124, 250, 0.08)',
      },
    },
  },
  plugins: [],
}