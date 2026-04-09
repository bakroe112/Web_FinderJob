/**
 * Color constants for JobHub application
 * Centralized color definitions to maintain consistent styling across all pages
 */

export const colors = {
  // Primary Colors - Navy Blue (Dark)
  primary: {
    darkest: '#013265',    // Main navy dark
    dark: '#014A94',       // Slightly lighter navy
    medium: '#0B2A4A',     // Even lighter navy
    light: '#CEE5FD',      // Very light navy
    lighter: '#F0F7FF',    // Almost white with navy tint
  },

  // Accent Colors - Golden
  accent: {
    main: '#F4C000',       // Main golden
    dark: '#DEA500',       // Darker golden
    light: '#FFF3C1',      // Light golden
  },

  // Neutral Colors
  neutral: {
    white: '#ffffff',
    background: '#F8FAFC', // Light background
    border: '#CEE5FD',     // Light border
    divider: '#E0E7FF',    // Divider color
  },

  // Text Colors
  text: {
    primary: '#013265',    // Main text - navy dark
    secondary: '#5B6B7C',  // Secondary text - gray
    light: '#BFCCD9',      // Light text
    white: '#ffffff',
  },

  // Status Colors
  status: {
    success: '#1F7A1F',    // Green for success
    error: '#E92020',      // Red for error
    warning: '#F4C000',    // Golden for warning
    info: '#0261C2',       // Blue for info
  },

  // Shadow Colors (with RGB for transparency)
  shadow: {
    navy: 'rgba(1, 50, 101, 0.08)',     // Light navy shadow
    navyMedium: 'rgba(1, 50, 101, 0.12)', // Medium navy shadow
    navyStrong: 'rgba(1, 50, 101, 0.2)',  // Strong navy shadow
  },

  // Gradients
  gradients: {
    primaryButton: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
    primaryButtonHover: 'linear-gradient(135deg, #014A94 0%, #0B2A4A 100%)',
    headerBar: 'linear-gradient(180deg, #013265 0%, #F4C000 100%)',
    accentBar: 'linear-gradient(90deg, #013265 0%, #F4C000 100%)',
  },
};

// Export individual color objects for easier usage
export const primaryColor = colors.primary;
export const accentColor = colors.accent;
export const textColor = colors.text;
export const statusColor = colors.status;

// Common color combinations
export const colorSchemes = {
  card: {
    background: colors.neutral.white,
    border: colors.primary.light,
    shadow: colors.shadow.navy,
  },
  button: {
    primary: colors.primary.darkest,
    accent: colors.accent.main,
    text: colors.neutral.white,
  },
  text: {
    primary: colors.text.primary,
    secondary: colors.text.secondary,
    muted: colors.text.light,
  },
};

export default colors;
