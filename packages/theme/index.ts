// Shared design tokens for all apps
export const colors = {
  primary: '#2F9E44',
  secondary: '#40C057',
  success: '#51CF66',
  warning: '#FCC419',
  error: '#FF6B6B',

  // Grays
  gray50: '#F8F9FA',
  gray100: '#F1F3F5',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#868E96',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',
} as const

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

// Priority colors
export const priorityColors = {
  low: colors.success,
  medium: colors.warning,
  high: colors.error,
} as const
