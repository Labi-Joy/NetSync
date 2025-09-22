import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NetSync custom color palette
        primary: {
          dark: '#251a1e',    // Main background
          accent: '#481f30',  // Secondary elements
          light: '#6b2c41',   // Tertiary elements
        },
        neon: {
          green: '#cdff81',   // Actions, highlights, glow effects
          'green-light': '#d9ff9f',
          'green-dark': '#b8e66b',
        },
        secondary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#1a1a1a',
        },
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          'from': {
            'box-shadow': '0 0 5px #cdff81, 0 0 10px #cdff81, 0 0 15px #cdff81',
          },
          'to': {
            'box-shadow': '0 0 10px #cdff81, 0 0 20px #cdff81, 0 0 30px #cdff81',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'neon': '0 0 5px #cdff81, 0 0 10px #cdff81, 0 0 15px #cdff81',
        'neon-strong': '0 0 10px #cdff81, 0 0 20px #cdff81, 0 0 30px #cdff81',
        'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #251a1e 0%, #481f30 100%)',
        'gradient-neon': 'linear-gradient(135deg, #cdff81 0%, #b8e66b 100%)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config