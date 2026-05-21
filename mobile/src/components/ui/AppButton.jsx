import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme';

export default function AppButton({
  children,
  disabled = false,
  loading = false,
  onPress,
  tone = 'primary',
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === 'secondary' && styles.secondary,
        tone === 'danger' && styles.danger,
        (pressed && !disabled && !loading) && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tone === 'secondary' ? colors.ink : '#ffffff'} />
      ) : (
        <Text style={[styles.label, tone === 'secondary' && styles.secondaryLabel]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.green,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 3,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.56,
  },
  label: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  pressed: {
    transform: [{ translateY: 2 }],
    shadowOpacity: 0.08,
  },
  secondary: {
    backgroundColor: '#ffffff',
    borderColor: colors.border,
    borderWidth: 1,
  },
  secondaryLabel: {
    color: colors.ink,
  },
});

