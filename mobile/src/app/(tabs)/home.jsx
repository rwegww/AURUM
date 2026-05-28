import React from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/ui/AppButton';
import MetricCard from '../../components/ui/MetricCard';
import Screen from '../../components/ui/Screen';
import { useAuth } from '../../context/AuthContext';
import { colors, shadow } from '../../theme';

export default function HomeTab() {
  const { refreshProfile, user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
    } finally {
      setRefreshing(false);
    }
  }, [refreshProfile]);

  return (
    <Screen
      eyebrow="AURUM Odyssey"
      onRefresh={refresh}
      refreshing={refreshing}
      title={`Chao ${user?.username || 'hoc vien'}`}
    >
      <View style={[styles.hero, shadow]}>
        <Text style={styles.heroKicker}>Nhiem vu tiep theo</Text>
        <Text style={styles.heroTitle}>Giu chuoi hoc tap va mo khoa them linh luc.</Text>
        <Text style={styles.heroCopy}>
          Vao lop hoc de tiep tuc lo trinh, hoac xem cac nhiem vu co the nhan thuong hom nay.
        </Text>
        <View style={styles.heroActions}>
          <AppButton onPress={() => router.push('/classroom')}>
            Vao lop hoc
          </AppButton>
          <AppButton tone="secondary" onPress={() => router.push('/missions')}>
            Xem nhiem vu
          </AppButton>
        </View>
      </View>

      <View style={styles.metrics}>
        <MetricCard label="Cap do" value={String(user?.level || 1)} />
        <MetricCard label="XP" tone={colors.violet} value={String(user?.xp || 0)} />
        <MetricCard label="Streak" tone={colors.amber} value={String(user?.streakCount || 0)} />
        <MetricCard
          label="Phut hom nay"
          tone={colors.blue}
          value={String(user?.todayOnlineMinutes || 0)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    padding: 20,
  },
  heroActions: {
    gap: 10,
    marginTop: 4,
  },
  heroCopy: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  heroKicker: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 29,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
