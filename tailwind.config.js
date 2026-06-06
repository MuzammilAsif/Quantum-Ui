/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/webview/**/*.{ts,tsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core background scale
        'q-void': '#050508',
        'q-deep': '#0a0a12',
        'q-base': '#0f0f1a',
        'q-surface': '#14141f',
        'q-elevated': '#1a1a2e',
        'q-overlay': '#1f1f38',
        'q-border': '#252540',
        'q-border-subtle': '#1c1c35',

        // Primary text scale
        'q-text': '#e8e8ff',
        'q-text-muted': '#8888bb',
        'q-text-faint': '#4a4a78',
        'q-text-ghost': '#2a2a55',

        // Purple accent
        'q-purple': {
          50: '#f0eeff',
          100: '#e0daff',
          200: '#c4b5fd',
          300: '#a78bfa',
          400: '#8b5cf6',
          500: '#7c3aed',
          600: '#6c2bd9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
          DEFAULT: '#8b5cf6',
          glow: 'rgba(139, 92, 246, 0.3)',
        },

        // Blue neon accent
        'q-blue': {
          100: '#e0f2fe',
          200: '#b0e0ff',
          300: '#69d2ff',
          400: '#22bcff',
          500: '#00aaff',
          600: '#0090e8',
          700: '#0075cc',
          DEFAULT: '#22bcff',
          glow: 'rgba(34, 188, 255, 0.25)',
        },

        // Cyan accent
        'q-cyan': {
          DEFAULT: '#06d6d6',
          glow: 'rgba(6, 214, 214, 0.2)',
        },

        // Status colors
        'q-success': '#10b981',
        'q-warning': '#f59e0b',
        'q-error': '#ef4444',
        'q-info': '#3b82f6',
      },

      fontFamily: {
        sans: ['"Geist"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Geist"', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        xs: ['0.6875rem', { lineHeight: '1rem' }],
        sm: ['0.75rem', { lineHeight: '1.125rem' }],
        base: ['0.8125rem', { lineHeight: '1.25rem' }],
        md: ['0.875rem', { lineHeight: '1.375rem' }],
        lg: ['0.9375rem', { lineHeight: '1.5rem' }],
        xl: ['1rem', { lineHeight: '1.5rem' }],
        '2xl': ['1.125rem', { lineHeight: '1.625rem' }],
      },

      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '3.5': '14px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
      },

      borderRadius: {
        xs: '3px',
        sm: '5px',
        DEFAULT: '7px',
        md: '9px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },

      boxShadow: {
        'q-sm': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'q-md': '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4)',
        'q-lg': '0 8px 24px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
        'q-purple': '0 0 20px rgba(139,92,246,0.2), 0 0 40px rgba(139,92,246,0.1)',
        'q-blue': '0 0 20px rgba(34,188,255,0.2), 0 0 40px rgba(34,188,255,0.1)',
        'q-glow-sm': '0 0 8px rgba(139,92,246,0.4)',
        'q-glow-md': '0 0 16px rgba(139,92,246,0.3)',
        'q-inset': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },

      backdropBlur: {
        xs: '2px',
        sm: '6px',
        DEFAULT: '12px',
        md: '16px',
        lg: '24px',
        xl: '40px',
      },

      backgroundImage: {
        'q-gradient-primary': 'linear-gradient(135deg, #8b5cf6 0%, #22bcff 100%)',
        'q-gradient-surface': 'linear-gradient(180deg, #1a1a2e 0%, #14141f 100%)',
        'q-gradient-glow': 'radial-gradient(ellipse at top, rgba(139,92,246,0.08) 0%, transparent 70%)',
        'q-gradient-mesh': `
          radial-gradient(at 40% 20%, rgba(139,92,246,0.06) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(34,188,255,0.04) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(6,214,214,0.03) 0px, transparent 50%)
        `,
        'q-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
      },

      transitionDuration: {
        fast: '100ms',
        DEFAULT: '150ms',
        normal: '200ms',
        slow: '300ms',
        slower: '500ms',
      },

      transitionTimingFunction: {
        'q-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'q-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'q-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'q-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },

      animation: {
        'q-spin': 'spin 1s linear infinite',
        'q-pulse': 'q-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'q-shimmer': 'q-shimmer 2s linear infinite',
        'q-glow': 'q-glow 3s ease-in-out infinite',
        'q-float': 'q-float 6s ease-in-out infinite',
      },

      keyframes: {
        'q-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'q-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'q-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(139,92,246,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(139,92,246,0.6)' },
        },
        'q-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },

      zIndex: {
        base: '0',
        elevated: '10',
        overlay: '20',
        modal: '30',
        popover: '40',
        tooltip: '50',
        max: '999',
      },
    },
  },
  plugins: [],
};