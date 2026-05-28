import React from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/ui/AppButton';
import MetricCard from '../../components/ui/MetricCard';
import Screen from '../../components/ui/Screen';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../lib/api';
import { colors, shadow } from '../../theme';

export default function ProfileTab() {
  const { logout, refreshProfile, user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
    } finally {
      setRefreshing(false);
    }
  }, [refreshProfile]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <Screen
      eyebrow="Ho so phu thuy"
      onRefresh={refresh}
      refreshing={refreshing}
      title={user?.username || 'AURUM'}
    >
      <View style={[styles.identity, shadow]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.username || 'A').slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={styles.identityText}>
          <Text style={styles.name}>{user?.username}</Text>
          <Text style={styles.role}>{user?.role || 'student'}</Text>
          <Text style={styles.email}>{user?.email || 'Chua co email'}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <MetricCard label="Cap do" value={String(user?.level || 1)} />
        <MetricCard label="Tong XP" tone={colors.violet} value={String(user?.xp || 0)} />
      </View>

      <View style={[styles.info, shadow]}>
        <Text style={styles.infoTitle}>Ket noi API</Text>
        <Text style={styles.infoCopy}>{API_BASE_URL}</Text>
      </View>

      <AppButton tone="danger" onPress={handleLogout}>
        Dang xuat
      </AppButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.green,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
  },
  email: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  identity: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 18,
  },
  identityText: {
    flex: 1,
    gap: 4,
  },
  info: {
    gap: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    padding: 16,
  },
  infoCopy: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  infoTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
  },
  name: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  role: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});

