/**
 * Design System Tokens
 * Centralized token definitions for the Ohouse AI design system
 */

// ==================== COLOR TOKENS ====================
export const colorTokens = {
  // Primary Colors
  primary: {
    dark: '#030213',
    light: '#ffffff',
  },

  // Semantic Colors
  semantic: {
    success: '#10b981', // Green
    error: '#d4183d', // Red
    warning: '#f59e0b', // Orange
    info: '#3b82f6', // Blue
  },

  // Neutral Scale
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d8',
    400: '#a1a1a9',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },

  // Brand Colors
  brand: {
    blue: '#3b82f6',
    darkBlue: '#1e40af',
    purple: '#8b5cf6',
    gray: '#ececf0',
  },

  // Backgrounds
  background: {
    light: '#ffffff',
    dark: '#030213',
    lightGray: '#f3f3f5',
  },

  // Borders
  border: {
    default: 'rgba(0, 0, 0, 0.1)',
    light: '#e5e5e5',
    dark: '#27272a',
  },

  // Opacity variants
  opacity: {
    full: 1,
    hover: 0.9,
    disabled: 0.5,
    subtle: 0.3,
  },
};

// ==================== TYPOGRAPHY TOKENS ====================
export const typographyTokens = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },

  fontSize: {
    xs: { size: '0.75rem', lineHeight: '1rem' }, // 12px
    sm: { size: '0.875rem', lineHeight: '1.25rem' }, // 14px
    base: { size: '1rem', lineHeight: '1.5rem' }, // 16px
    lg: { size: '1.125rem', lineHeight: '1.75rem' }, // 18px
    xl: { size: '1.25rem', lineHeight: '1.75rem' }, // 20px
    '2xl': { size: '1.5rem', lineHeight: '2rem' }, // 24px
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Typography Scale
  scale: {
    h1: {
      size: '2rem',
      weight: 600,
      lineHeight: '2.5rem',
      letterSpacing: '-0.41px',
    },
    h2: {
      size: '1.5rem',
      weight: 600,
      lineHeight: '2rem',
      letterSpacing: '0',
    },
    h3: {
      size: '1.25rem',
      weight: 600,
      lineHeight: '1.75rem',
      letterSpacing: '0',
    },
    h4: {
      size: '1.125rem',
      weight: 600,
      lineHeight: '1.75rem',
      letterSpacing: '0',
    },
    h5: {
      size: '1rem',
      weight: 600,
      lineHeight: '1.5rem',
      letterSpacing: '0',
    },
    h6: {
      size: '0.875rem',
      weight: 600,
      lineHeight: '1.25rem',
      letterSpacing: '0',
    },
    body: {
      size: '1rem',
      weight: 400,
      lineHeight: '1.5rem',
      letterSpacing: '0',
    },
    bodySmall: {
      size: '0.875rem',
      weight: 400,
      lineHeight: '1.25rem',
      letterSpacing: '0',
    },
    caption: {
      size: '0.75rem',
      weight: 400,
      lineHeight: '1rem',
      letterSpacing: '0',
    },
    label: {
      size: '0.875rem',
      weight: 500,
      lineHeight: '1.25rem',
      letterSpacing: '0',
    },
  },
};

// ==================== SPACING TOKENS ====================
export const spacingTokens = {
  xs: '2px',
  sm: '4px',
  md: '6px',
  base: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '32px',
};

export const spacingScale = {
  2: 2,
  4: 4,
  6: 6,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
};

export const spacingPurpose = {
  textCombination: ['xs', 'sm', 'md', 'base'], // 2px-8px
  elementSpacing: ['md', 'base', 'lg'], // 6px-12px
  componentInternal: ['lg', 'xl'], // 12px-16px
  componentExternal: ['xl', '2xl', '3xl'], // 16px-24px
  sectionSeparation: ['4xl'], // 32px
};

// ==================== RADIUS TOKENS ====================
export const radiusTokens = {
  xs: '2px',
  sm: '6px',
  md: '8px',
  base: '10px', // --radius from globals.css
  lg: '14px',
  xl: '16px',
  full: '9999px',
};

// ==================== SHADOW/ELEVATION TOKENS ====================
export const shadowTokens = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  glowBlue: '0 0 8px rgba(59, 130, 246, 0.8)',
  glowBlueStrong: '0 0 10px rgba(59, 130, 246, 0.8)',
};

// ==================== ANIMATION TOKENS ====================
export const animationTokens = {
  duration: {
    fast: 150, // ms
    base: 350, // ms
    slow: 500, // ms
  },

  easing: {
    easeInOut: 'cubic-bezier(.4, 0, .2, 1)',
    easeIn: 'cubic-bezier(.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, .2, 1)',
    custom: 'cubic-bezier(.32, .72, 0, 1)',
  },

  zIndex: {
    base: 10,
    overlay: 20,
    modal: 30,
    toast: 50,
  },
};

// ==================== BORDER TOKENS ====================
export const borderTokens = {
  width: {
    thin: '1px',
    medium: '2px',
  },

  radius: radiusTokens,
};

// ==================== FOCUS STATE TOKENS ====================
export const focusTokens = {
  outline: '2px solid rgba(59, 130, 246, 0.5)',
  outlineOffset: '2px',
  color: 'rgba(59, 130, 246, 0.5)',
};

// ==================== COMPONENT SIZE TOKENS ====================
export const componentSizeTokens = {
  // Button sizes
  button: {
    sm: { height: '32px', padding: '6px 12px', fontSize: '0.875rem' },
    base: { height: '40px', padding: '8px 16px', fontSize: '1rem' },
    lg: { height: '48px', padding: '12px 20px', fontSize: '1.125rem' },
  },

  // Input sizes
  input: {
    sm: { height: '32px', padding: '6px 12px', fontSize: '0.875rem' },
    base: { height: '40px', padding: '8px 12px', fontSize: '1rem' },
    lg: { height: '48px', padding: '12px 16px', fontSize: '1.125rem' },
  },

  // Navigation
  navigation: {
    height: '44px',
    tabBar: '44px',
  },

  // Mobile viewport
  viewport: {
    width: 375,
    height: 812,
  },
};

// ==================== ALL TOKENS EXPORT ====================
export const designTokens = {
  color: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  shadow: shadowTokens,
  animation: animationTokens,
  border: borderTokens,
  focus: focusTokens,
  componentSize: componentSizeTokens,
};

export default designTokens;
