import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, font, radius, shadow, spacing } from '@/theme';

export const Card = ({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) => (
  <View style={[styles.card, tone === 'dark' && styles.darkCard]}>{children}</View>
);

export const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
  </View>
);

export const PrimaryButton = ({
  title,
  onPress,
  disabled,
  loading,
  tone = 'green',
}: {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'green' | 'blue' | 'dark' | 'ghost';
}) => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled || loading}
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      tone === 'blue' && styles.buttonBlue,
      tone === 'dark' && styles.buttonDark,
      tone === 'ghost' && styles.buttonGhost,
      (pressed && !disabled) && styles.buttonPressed,
      (disabled || loading) && styles.buttonDisabled,
    ]}
  >
    {loading ? <ActivityIndicator color={tone === 'ghost' ? colors.green : '#fff'} /> : <Text style={[styles.buttonText, tone === 'ghost' && styles.ghostText]}>{title}</Text>}
  </Pressable>
);

export const TextField = ({ label, error, ...props }: TextInputProps & { label?: string; error?: string }) => (
  <View style={styles.fieldWrap}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput
      placeholderTextColor="#9ca3af"
      style={[styles.input, error && styles.inputError]}
      autoCapitalize="none"
      {...props}
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

export const EmptyState = ({ title, body }: { title: string; body?: string }) => (
  <Card>
    <Text style={styles.emptyTitle}>{title}</Text>
    {body ? <Text style={styles.emptyBody}>{body}</Text> : null}
  </Card>
);

export const Tag = ({ children, tone = 'green' }: { children: React.ReactNode; tone?: 'green' | 'blue' | 'yellow' | 'muted' }) => (
  <View style={[styles.tag, tone === 'blue' && styles.tagBlue, tone === 'yellow' && styles.tagYellow, tone === 'muted' && styles.tagMuted]}>
    <Text style={[styles.tagText, tone === 'muted' && styles.tagMutedText]}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.card,
  },
  darkCard: {
    backgroundColor: colors.labCard,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionHeader: {
    gap: 4,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: font.heavy,
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: font.medium,
  },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonBlue: {
    backgroundColor: colors.blue,
  },
  buttonDark: {
    backgroundColor: colors.text,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonPressed: {
    transform: [{ translateY: 2 }],
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: font.heavy,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ghostText: {
    color: colors.green,
  },
  fieldWrap: {
    gap: 6,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: font.heavy,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 15,
    fontWeight: font.medium,
  },
  inputError: {
    borderColor: colors.red,
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontWeight: font.bold,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: font.heavy,
  },
  emptyBody: {
    color: colors.muted,
    lineHeight: 20,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(118,192,52,0.12)',
  },
  tagBlue: {
    backgroundColor: 'rgba(28,176,246,0.12)',
  },
  tagYellow: {
    backgroundColor: 'rgba(255,200,0,0.2)',
  },
  tagMuted: {
    backgroundColor: '#f3f4f6',
  },
  tagText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: font.heavy,
    textTransform: 'uppercase',
  },
  tagMutedText: {
    color: colors.muted,
  },
});
