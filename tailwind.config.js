/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/webview/**/*.{ts,tsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core background scale — now CSS-variable driven so the
        // dark/light toggle actually changes them at runtime.
        'q-void': 'var(--q-void)',
        'q-deep': 'var(--q-deep)',
        'q-base': 'var(--q-base)',
        'q-surface': 'var(--q-surface)',
        'q-elevated': 'var(--q-elevated)',
        'q-overlay': 'var(--q-overlay)',
        'q-border': 'var(--q-border)',
        'q-border-subtle': 'var(--q-border-subtle)',

        // Text scale
        'q-text': 'var(--q-text)',
        'q-text-muted': 'var(--q-text-muted)',
        'q-text-faint': 'var(--q-text-faint)',
        'q-text-ghost': 'var(--q-text-ghost)',

        // Status colors — kept as fixed hex, these are semantic
        // (success/error) and shouldn't shift with theme
        'q-success': '#10b981',
        'q-warning': '#f59e0b',
        'q-error': '#ef4444',
        'q-info': '#71717a',
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
        '0.5': '2px', '1': '4px', '1.5': '6px', '2': '8px',
        '2.5': '10px', '3': '12px', '3.5': '14px', '4': '16px',
        '5': '20px', '6': '24px', '8': '32px', '10': '40px', '12': '48px',
      },

      borderRadius: {
        xs: '3px', sm: '5px', DEFAULT: '7px', md: '9px',
        lg: '12px', xl: '16px', '2xl': '20px',
      },

      boxShadow: {
        'q-sm': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'q-md': '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4)',
        'q-lg': '0 8px 24px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
        'q-glow-sm': '0 0 8px var(--q-accent-glow)',
        'q-glow-md': '0 0 16px var(--q-accent-glow)',
        'q-inset': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },

      backdropBlur: {
        xs: '2px', sm: '6px', DEFAULT: '12px', md: '16px', lg: '24px', xl: '40px',
      },

      backgroundImage: {
        // Monochrome white-to-grey sheen instead of purple-to-blue
        'q-gradient-primary': 'linear-gradient(135deg, var(--q-text) 0%, var(--q-text-muted) 100%)',
        'q-gradient-surface': 'linear-gradient(180deg, var(--q-elevated) 0%, var(--q-surface) 100%)',
        'q-gradient-glow': 'radial-gradient(ellipse at top, var(--q-glow-tint) 0%, transparent 70%)',
        'q-gradient-mesh': `
          radial-gradient(at 40% 20%, var(--q-mesh-a) 0px, transparent 50%),
          radial-gradient(at 80% 0%, var(--q-mesh-b) 0px, transparent 50%),
          radial-gradient(at 0% 50%, var(--q-mesh-c) 0px, transparent 50%)
        `,
        'q-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
      },

      transitionDuration: {
        fast: '100ms', DEFAULT: '150ms', normal: '200ms', slow: '300ms', slower: '500ms',
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
        'q-pulse': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        'q-shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'q-glow': {
          '0%, 100%': { boxShadow: '0 0 8px var(--q-accent-glow)' },
          '50%': { boxShadow: '0 0 20px var(--q-accent-glow)' },
        },
        'q-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },

      zIndex: {
        base: '0', elevated: '10', overlay: '20', modal: '30',
        popover: '40', tooltip: '50', max: '999',
      },
    },
  },
  plugins: [],
};