import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getRoleHomeRoute } from '@aurum/shared/auth';
import { useAuth } from '@/auth/AuthProvider';
import { colors, font, spacing } from '@/theme';

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{ token?: string; error?: string }>();
  const { magicLogin, user, isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (params.error) router.replace(`/login?error=${encodeURIComponent(String(params.error))}` as never);
    if (params.token) {
      magicLogin(String(params.token)).then((result) => {
        if (result.success && result.user) router.replace(getRoleHomeRoute(result.user.role) as never);
        else router.replace(`/login?error=${encodeURIComponent(result.message || 'Không thể xác thực.')}` as never);
      });
    }
  }, [magicLogin, params.error, params.token]);

  useEffect(() => {
    if (!loading && isLoggedIn && user) router.replace(getRoleHomeRoute(user.role) as never);
  }, [isLoggedIn, loading, user]);

  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.green} size="large" />
      <Text style={styles.text}>Đang xác thực...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    gap: spacing.md,
  },
  text: {
    color: colors.muted,
    fontWeight: font.heavy,
  },
});
