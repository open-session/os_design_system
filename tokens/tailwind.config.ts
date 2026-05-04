/**
 * Open Session Design System - Tailwind Configuration
 *
 * This configuration extends Tailwind CSS with Open Session brand tokens.
 * Import this config in your project's tailwind.config.ts to use the design system.
 *
 * Usage:
 * ```ts
 * // tailwind.config.ts
 * import osTokens from '@open-session/design-system/tokens/tailwind.config';
 *
 * export default {
 *   presets: [osTokens],
 *   // your project-specific config
 * }
 * ```
 *
 * Or merge manually:
 * ```ts
 * import { theme } from '@open-session/design-system/tokens/tailwind.config';
 *
 * export default {
 *   theme: {
 *     extend: {
 *       ...theme.extend,
 *       // your extensions
 *     }
 *   }
 * }
 * ```
 */

import type { Config } from 'tailwindcss';

const config = {
  darkMode: 'class',
  theme: {
    extend: {
      // ============================================
      // BRAND COLORS
      // ============================================
      colors: {
        // Primary brand colors (use these for direct access)
        brand: {
          charcoal: '#191919',
          vanilla: '#FFFAEE',
          aperol: '#FE5102',
        },

        // ============================================
        // SEMANTIC TOKENS (mapped to CSS variables)
        // ============================================

        // Background semantic tokens
        bg: {
          primary: 'var(--bg-primary)',
          'primary-alt': 'var(--bg-primary_alt)',
          'primary-hover': 'var(--bg-primary_hover)',
          secondary: 'var(--bg-secondary)',
          'secondary-alt': 'var(--bg-secondary_alt)',
          'secondary-hover': 'var(--bg-secondary_hover)',
          tertiary: 'var(--bg-tertiary)',
          quaternary: 'var(--bg-quaternary)',
          active: 'var(--bg-primary_hover)',
          overlay: 'var(--bg-overlay)',
        },

        // Foreground/text semantic tokens
        fg: {
          primary: 'var(--fg-primary)',
          secondary: 'var(--fg-secondary)',
          'secondary-hover': 'var(--fg-secondary_hover)',
          tertiary: 'var(--fg-tertiary)',
          quaternary: 'var(--fg-quaternary)',
          quinary: 'var(--fg-quinary)',
          placeholder: 'var(--fg-placeholder)',
          white: 'var(--fg-white)',
          'brand-primary': 'var(--fg-brand-primary)',
          'brand-secondary': 'var(--fg-brand-secondary)',
          'error-primary': 'var(--fg-error-primary)',
          'warning-primary': 'var(--fg-warning-primary)',
          'success-primary': 'var(--fg-success-primary)',
        },

        // Border semantic tokens
        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
          tertiary: 'var(--border-tertiary)',
          brand: 'var(--border-brand)',
          'brand-solid': 'var(--border-brand-solid)',
          error: 'var(--border-error)',
          warning: 'var(--border-warning)',
          success: 'var(--border-success)',
        },

        // Button semantic tokens
        button: {
          'primary-fg': 'var(--button-primary-fg)',
          'primary-bg': 'var(--button-primary-bg)',
          'primary-bg-hover': 'var(--button-primary-bg_hover)',
          'primary-icon': 'var(--button-primary-icon)',
          'primary-icon_hover': 'var(--button-primary-icon_hover)',
          'secondary-fg': 'var(--button-secondary-fg)',
          'secondary-bg': 'var(--button-secondary-bg)',
          'secondary-border': 'var(--button-secondary-border)',
          'tertiary-fg': 'var(--button-tertiary-fg)',
        },

        // Brand background variants
        'bg-brand': {
          primary: 'var(--bg-brand-primary)',
          'primary-alt': 'var(--bg-brand-primary_alt)',
          secondary: 'var(--bg-brand-secondary)',
          solid: 'var(--bg-brand-solid)',
          'solid-hover': 'var(--bg-brand-solid_hover)',
        },

        // Error/Warning/Success backgrounds
        'bg-error': {
          primary: 'var(--bg-error-primary)',
          secondary: 'var(--bg-error-secondary)',
          solid: 'var(--bg-error-solid)',
        },
        'bg-warning': {
          primary: 'var(--bg-warning-primary)',
          secondary: 'var(--bg-warning-secondary)',
          solid: 'var(--bg-warning-solid)',
        },
        'bg-success': {
          primary: 'var(--bg-success-primary)',
          secondary: 'var(--bg-success-secondary)',
          solid: 'var(--bg-success-solid)',
        },

        // ============================================
        // COLOR SCALES
        // ============================================
        gray: {
          25: 'var(--color-gray-25)',
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
          950: 'var(--color-gray-950)',
        },

        error: {
          25: 'var(--color-error-25)',
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          800: 'var(--color-error-800)',
          900: 'var(--color-error-900)',
          950: 'var(--color-error-950)',
        },

        warning: {
          25: 'var(--color-warning-25)',
          50: 'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          200: 'var(--color-warning-200)',
          300: 'var(--color-warning-300)',
          400: 'var(--color-warning-400)',
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
          800: 'var(--color-warning-800)',
          900: 'var(--color-warning-900)',
          950: 'var(--color-warning-950)',
        },

        success: {
          25: 'var(--color-success-25)',
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          200: 'var(--color-success-200)',
          300: 'var(--color-success-300)',
          400: 'var(--color-success-400)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
          800: 'var(--color-success-800)',
          900: 'var(--color-success-900)',
          950: 'var(--color-success-950)',
        },

        // ============================================
        // UTILITY COLOR SCALES (for badges, icons)
        // ============================================
        'utility-brand': {
          50: 'var(--color-utility-brand-50)',
          100: 'var(--color-utility-brand-100)',
          200: 'var(--color-utility-brand-200)',
          400: 'var(--color-utility-brand-400)',
          500: 'var(--color-utility-brand-500)',
          700: 'var(--color-utility-brand-700)',
        },
        'utility-neutral': {
          50: 'var(--color-utility-neutral-50)',
          100: 'var(--color-utility-neutral-100)',
          200: 'var(--color-utility-neutral-200)',
          300: 'var(--color-utility-neutral-300)',
          400: 'var(--color-utility-neutral-400)',
          500: 'var(--color-utility-neutral-500)',
          700: 'var(--color-utility-neutral-700)',
        },
      },

      // ============================================
      // BOX SHADOWS
      // ============================================
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        '3xl': 'var(--shadow-3xl)',
        'focus-ring': '0 0 0 3px var(--focus-ring-shadow)',
        'focus-ring-elevated': 'var(--shadow-xs), 0 0 0 3px var(--focus-ring-shadow)',
        'focus-ring-error': '0 0 0 3px var(--focus-ring-error-shadow)',
      },

      // ============================================
      // RING COLORS (focus states)
      // ============================================
      ringColor: {
        brand: 'var(--focus-ring)',
        error: 'var(--focus-ring-error)',
        primary: 'var(--ring-primary)',
      },

      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        sans: ['"Neue Haas Grotesk Text Pro"', 'system-ui', 'sans-serif'],
        display: ['"Neue Haas Grotesk Display Pro"', 'system-ui', 'sans-serif'],
        accent: ['OffBit', '"Neue Haas Grotesk Text Pro"', 'sans-serif'],
        mono: ['"Neue Haas Grotesk Text Pro"', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        brand: '12px',
        'brand-lg': '16px',
      },

      letterSpacing: {
        'tight-sm': '-0.5px',
        'tight-md': '-1px',
        'tight-lg': '-2px',
      },

      // ============================================
      // MOTION TOKENS
      // ============================================
      transitionTimingFunction: {
        'motion-out': 'var(--ease-out)',
        'motion-in': 'var(--ease-in)',
        'motion-in-out': 'var(--ease-in-out)',
      },
      transitionDuration: {
        micro: 'var(--duration-micro)',
        quick: 'var(--duration-quick)',
        standard: 'var(--duration-standard)',
        moderate: 'var(--duration-moderate)',
        page: 'var(--duration-page)',
      },

      // ============================================
      // ANIMATIONS
      // ============================================
      animation: {
        blob: 'blob 10s infinite',
        cursor: 'cursor .75s step-end infinite',
        'dot-pulse': 'dot-pulse 1.4s ease-in-out infinite',
        'dot-wave': 'dot-wave 0.6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        cursor: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'dot-pulse': {
          '0%, 100%': { transform: 'scale(0.8)', opacity: '0.4' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
        'dot-wave': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-4px) scale(1.1)' },
        },
      },
    },
  },
} satisfies Config;

export default config;
export const { theme } = config;
