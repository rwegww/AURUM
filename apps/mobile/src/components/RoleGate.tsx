import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { useAuth } from '@/auth/AuthProvider';

export const RoleGate = ({ allow, children }: { allow?: string[]; children: React.ReactNode }) => {
  const { user, loading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn || !user) {
      router.replace('/login');
      return;
    }
    if (allow?.length && !allow.includes(user.role)) {
      router.replace(user.role === 'admin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/');
    }
  }, [allow, isLoggedIn, loading, user]);

  if (loading || !isLoggedIn || !user || (allow?.length && !allow.includes(user.role))) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.green} size="large" />
        <Text style={styles.loadingText}>Đang chuẩn bị không gian học tập...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.bg,
    padding: spacing.lg,
  },
  loadingText: {
    color: colors.muted,
    fontWeight: font.bold,
    textAlign: 'center',
  },
});
