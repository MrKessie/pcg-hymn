// src/theme/theme.js
export const theme = {
  colors: {
    // Primary brand: Cathedral Navy
    primary: "#0E2140",
    primaryLight: "#1B365D",
    primaryDark: "#071120",

    // Liturgical Accent: Regal Gold
    secondary: "#C89D3C",
    secondaryLight: "#DFB85C",
    secondaryDark: "#9A7522",

    // Background & Surfaces
    background: "#F8F9FA",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    surfaceCard: "#F1F4F9",

    // Typography
    text: "#1A202C",
    textSecondary: "#5A6A80",
    textLight: "#8C9BAE",
    textOnPrimary: "#FFFFFF",

    // Borders & Dividers
    border: "#E2E8F0",
    borderLight: "#EDF2F7",

    // Feedback
    error: "#C53030",
    success: "#2F855A",
    warning: "#DD6B20",
    info: "#3182CE",

    // Base
    white: "#FFFFFF",
    black: "#000000",
    overlay: "rgba(7, 17, 32, 0.65)",

    // Dark mode palette (Midnight Navy / Slate)
    darkBackground: "#0B132B",
    darkSurface: "#141E38",
    darkSurfaceElevated: "#1C2A4F",
    darkSurfaceCard: "#111A33",
    darkText: "#F0F4F8",
    darkTextSecondary: "#94A3B8",
    darkBorder: "#243256",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 26,
    title: 30,
    display: 36,
  },
  borderRadius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 22,
    round: 999,
  },
  shadows: {
    sm: {
      shadowColor: "#0E2140",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#0E2140",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#0E2140",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.14,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const getThemeColors = (darkMode) => ({
  background: darkMode ? theme.colors.darkBackground : theme.colors.background,
  surface: darkMode ? theme.colors.darkSurface : theme.colors.surface,
  surfaceElevated: darkMode ? theme.colors.darkSurfaceElevated : theme.colors.surfaceElevated,
  surfaceCard: darkMode ? theme.colors.darkSurfaceCard : theme.colors.surfaceCard,
  text: darkMode ? theme.colors.darkText : theme.colors.text,
  textSecondary: darkMode ? theme.colors.darkTextSecondary : theme.colors.textSecondary,
  textLight: darkMode ? "#64748B" : theme.colors.textLight,
  border: darkMode ? theme.colors.darkBorder : theme.colors.border,
  borderLight: darkMode ? "#1E2C4C" : theme.colors.borderLight,
  primary: darkMode ? "#2D5086" : theme.colors.primary,
  primaryLight: theme.colors.primaryLight,
  primaryDark: theme.colors.primaryDark,
  secondary: theme.colors.secondary,
  secondaryLight: theme.colors.secondaryLight,
  error: theme.colors.error,
  success: theme.colors.success,
  isDark: !!darkMode,
});
