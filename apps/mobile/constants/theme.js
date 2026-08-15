import { Platform } from "react-native";

export const colors = {
  bg: "#fffbf0",
  surface: "#ffffff",
  surfaceAlt: "#f4faef",
  ink: "#1a1a1a",
  muted: "#667085",
  border: "#e8e8e8",
  green: "#5ba315",
  greenDark: "#437d0c",
  blue: "#1cb0f6",
  violet: "#8b5cf6",
  amber: "#f5b942",
  red: "#ef4444",
  slate: "#263238"
};

const systemSans = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "system-ui",
  default: "system-ui"
});

export const typography = {
  regular: systemSans,
  medium: systemSans,
  bold: systemSans
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24
};

export const shadow = {
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)"
};
