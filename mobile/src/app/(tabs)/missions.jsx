import React from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/ui/AppButton';
import Screen from '../../components/ui/Screen';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { colors, shadow } from '../../theme';

const progressText = (mission) => {
  const current = mission.currentCount || 0;
  const target = mission.target_count || 1;
  return `${Math.min(current, target)}/${target}`;
};

export default function MissionsTab() {
  const { logout, refreshProfile, token } = useAuth();
  const [claimingId, setClaimingId] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [missions, setMissions] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadMissions = React.useCallback(async () => {
    setError(null);
    const data = await apiRequest('/api/missions', { token });
    setMissions(Array.isArray(data) ? data : []);
  }, [token]);

  const handleRequestError = React.useCallback(async (requestError) => {
    if (requestError.status === 401) {
      await logout();
      router.replace('/login');
      return;
    }
    setError(requestError.message);
  }, [logout]);

  React.useEffect(() => {
    let active = true;
    loadMissions()
      .catch(async (loadError) => {
        if (active) await handleRequestError(loadError);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [handleRequestError, loadMissions]);

  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await loadMissions();
    } catch (loadError) {
      await handleRequestError(loadError);
    } finally {
      setRefreshing(false);
    }
  }, [handleRequestError, loadMissions]);

  const claimMission = async (missionId) => {
    setClaimingId(missionId);
    setError(null);
    try {
      await apiRequest('/api/missions/claim', {
        method: 'POST',
        token,
        body: { missionId },
      });
      await Promise.all([loadMissions(), refreshProfile()]);
    } catch (claimError) {
      await handleRequestError(claimError);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <Screen
      eyebrow="Van phong than sang"
      onRefresh={refresh}
      refreshing={refreshing}
      title="Nhiem vu"
    >
      {loading ? <ActivityIndicator color={colors.green} size="large" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && missions.length === 0 ? (
        <View style={[styles.empty, shadow]}>
          <Text style={styles.emptyTitle}>Chua co nhiem vu</Text>
          <Text style={styles.emptyCopy}>Hoi dong phap su chua giao nhiem vu moi.</Text>
        </View>
      ) : null}

      {missions.map((mission) => {
        const canClaim = mission.isCompleted && !mission.isClaimed;
        return (
          <View key={mission.id} style={[styles.card, shadow]}>
            <View style={styles.cardHeader}>
              <Text style={styles.type}>{mission.type || 'mission'}</Text>
              <Text style={styles.reward}>+{mission.xp_reward || 0} XP</Text>
            </View>
            <Text style={styles.title}>{mission.title || mission.name || 'Nhiem vu AURUM'}</Text>
            {mission.description ? (
              <Text style={styles.copy}>{mission.description}</Text>
            ) : null}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      100,
                      ((mission.currentCount || 0) / (mission.target_count || 1)) * 100
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progress}>{progressText(mission)}</Text>
            {mission.isClaimed ? (
              <Text style={styles.claimed}>Da nhan thuong</Text>
            ) : (
              <AppButton
                disabled={!canClaim}
                loading={claimingId === mission.id}
                onPress={() => claimMission(mission.id)}
                tone={canClaim ? 'primary' : 'secondary'}
              >
                {canClaim ? 'Nhan thuong' : 'Dang tien hanh'}
              </AppButton>
            )}
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 18,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  claimed: {
    color: colors.greenDark,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  copy: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  empty: {
    gap: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 18,
  },
  emptyCopy: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '800',
  },
  progress: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  progressFill: {
    backgroundColor: colors.green,
    borderRadius: 999,
    height: '100%',
  },
  progressTrack: {
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
  },
  reward: {
    color: colors.violet,
    fontSize: 13,
    fontWeight: '900',
  },
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 25,
  },
  type: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
