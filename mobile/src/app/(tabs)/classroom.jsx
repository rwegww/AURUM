import React from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/ui/AppButton';
import Screen from '../../components/ui/Screen';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { colors, shadow } from '../../theme';

export default function ClassroomTab() {
  const { logout, token } = useAuth();
  const [classes, setClasses] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadClasses = React.useCallback(async () => {
    setError(null);
    const data = await apiRequest('/api/classes', { token });
    setClasses(Array.isArray(data) ? data : []);
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
    loadClasses()
      .catch(async (loadError) => {
        if (active) await handleRequestError(loadError);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [handleRequestError, loadClasses]);

  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await loadClasses();
    } catch (loadError) {
      await handleRequestError(loadError);
    } finally {
      setRefreshing(false);
    }
  }, [handleRequestError, loadClasses]);

  return (
    <Screen
      eyebrow="Dai sanh duong"
      onRefresh={refresh}
      refreshing={refreshing}
      title="Lop hoc"
    >
      {loading ? <ActivityIndicator color={colors.green} size="large" /> : null}
      {error ? (
        <View style={[styles.empty, shadow]}>
          <Text style={styles.emptyTitle}>Khong tai duoc lop hoc</Text>
          <Text style={styles.emptyCopy}>{error}</Text>
          <AppButton onPress={refresh}>Thu lai</AppButton>
        </View>
      ) : null}

      {!loading && !error && classes.length === 0 ? (
        <View style={[styles.empty, shadow]}>
          <Text style={styles.emptyTitle}>Chua tham gia lop nao</Text>
          <Text style={styles.emptyCopy}>
            Khi giao vien moi ban vao lop, cac phong hoc se xuat hien o day.
          </Text>
        </View>
      ) : null}

      {classes.map((item) => (
        <View key={item.id} style={[styles.classCard, shadow]}>
          <Text style={styles.className}>{item.name || 'Lop hoc AURUM'}</Text>
          <Text style={styles.classMeta}>
            Giao vien: {item.teacher?.username || 'Chua ro'}
          </Text>
          <Text style={styles.classMeta}>
            Hoc vien: {item.student_count || 0}
          </Text>
          {item.code ? <Text style={styles.code}>Ma lop: {item.code}</Text> : null}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  classCard: {
    gap: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 18,
  },
  classMeta: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  className: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  code: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt,
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    textTransform: 'uppercase',
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
    lineHeight: 22,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
});
