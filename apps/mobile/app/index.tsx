import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { getRoleHomeRoute } from '@aurum/shared/auth';
import { useAuth } from '@/auth/AuthProvider';
import { colors, font, spacing } from '@/theme';

export default function EntryScreen() {
  const { loading, user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn || !user) router.replace('/login');
    else router.replace(getRoleHomeRoute(user.role) as never);
  }, [isLoggedIn, loading, user]);

  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.green} size="large" />
      <Text style={styles.text}>Đang mở AURUM...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  text: {
    color: colors.muted,
    fontWeight: font.bold,
  },
});
