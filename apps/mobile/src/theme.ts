import { Platform, StyleSheet } from 'react-native';

export const colors = {
  green: '#76c034',
  greenDark: '#4b9f1b',
  bg: '#fffbf0',
  surface: '#ffffff',
  border: '#e8e8e8',
  text: '#1a1a1a',
  muted: '#666666',
  blue: '#1cb0f6',
  yellow: '#ffc800',
  red: '#ef4444',
  labBg: '#0a0c10',
  labCard: '#161b22',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
};

export const shadow = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
});

export const font = {
  heavy: '900' as const,
  bold: '800' as const,
  medium: '600' as const,
};
