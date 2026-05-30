import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { BookOpen, Brain, FlaskConical, Map, Swords, Trophy, X } from 'lucide-react-native';
import { useAuth } from '@/auth/AuthProvider';
import { AppScreen } from '@/components/AppScreen';
import { Card, EmptyState, PrimaryButton, SectionTitle, Tag } from '@/components/Primitives';
import { useApiResource } from '@/lib/useApiResource';
import { colors, font, radius, spacing } from '@/theme';

type Mission = {
  id: string;
  title?: string;
  description?: string;
  reward_xp?: number;
  completed?: boolean;
  claimed?: boolean;
};

const features = [
  { title: 'Bài học', subtitle: 'Lớp 8-12, lý thuyết và thảo luận', href: '/lessons', icon: BookOpen, color: colors.green },
  { title: 'Phòng lab', subtitle: 'Mô phỏng, cân bằng, phân tử, solver', href: '/lab', icon: FlaskConical, color: colors.blue },
  { title: 'Đấu trường', subtitle: 'Room, trận đấu và bảng xếp hạng', href: '/arena', icon: Swords, color: '#f97316' },
  { title: 'Bản đồ kiến thức', subtitle: 'Ôn tập chủ đề hóa học trọng tâm', href: '/knowledge-map', icon: Map, color: '#8b5cf6' },
  { title: 'Máy tính hóa', subtitle: 'Công thức, đơn vị, pH, molarity', href: '/calculator', icon: Brain, color: colors.yellow },
  { title: 'Thư viện', subtitle: 'Tài liệu, phản hồi, tải xuống', href: '/library', icon: Trophy, color: '#14b8a6' },
];

export const HomeScreen = () => {
  const { user, token } = useAuth();
  const [missionOpen, setMissionOpen] = useState(false);
  const { data: missions, loading: missionsLoading, reload: reloadMissions } = useApiResource<Mission[]>(token ? '/missions' : null, { auth: true });
  const { data: praises } = useApiResource<Record<string, unknown>[]>('/user/public-praises');

  const completed = useMemo(() => missions?.filter((mission) => mission.completed || mission.claimed).length || 0, [missions]);

  const claimMission = async (missionId: string) => {
    const { api } = await import('@/lib/api');
    await api.post('/missions/claim', { missionId }, { token });
    reloadMissions();
  };

  return (
    <AppScreen title={`Chào ${user?.username || 'AURUM'}`} subtitle={`XP ${user?.xp || 0} • Streak ${user?.streakCount || 0} ngày`}>
      <Card>
        <Tag tone="yellow">Hôm nay</Tag>
        <Text style={styles.heroTitle}>Tiếp tục hành trình hóa học của bạn</Text>
        <Text style={styles.heroBody}>Hoàn thành bài học, làm nhiệm vụ, vào lab và theo dõi lớp học chỉ trong một app native.</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={styles.statValue}>{user?.todayOnlineMinutes || 0}</Text><Text style={styles.statLabel}>phút học</Text></View>
          <View style={styles.statBox}><Text style={styles.statValue}>{completed}</Text><Text style={styles.statLabel}>nhiệm vụ</Text></View>
        </View>
        <PrimaryButton title="Mở nhiệm vụ" onPress={() => setMissionOpen(true)} />
      </Card>

      <SectionTitle title="Tính năng web đã có trên mobile" subtitle="Các flow chính được chuyển sang native và dùng cùng API AURUM." />
      <View style={styles.grid}>
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Pressable key={feature.href} onPress={() => router.push(feature.href as never)} style={styles.feature}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color }]}><Icon size={22} color="#fff" /></View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle title="Vinh danh" subtitle="Dữ liệu lấy từ /api/user/public-praises giống web." />
      {praises?.length ? (
        <View style={styles.praiseList}>
          {praises.slice(0, 5).map((item, index) => (
            <Card key={String(item.id || index)}>
              <Text style={styles.featureTitle}>{String(item.username || item.name || `Học viên ${index + 1}`)}</Text>
              <Text style={styles.featureSubtitle}>{String(item.message || item.description || 'Đang tiến bộ trong AURUM')}</Text>
            </Card>
          ))}
        </View>
      ) : <EmptyState title="Chưa có vinh danh" body="Khi backend có dữ liệu public praise, app sẽ hiển thị tại đây." />}

      <Modal visible={missionOpen} animationType="slide" onRequestClose={() => setMissionOpen(false)}>
        <AppScreen title="Nhiệm vụ" subtitle="Bottom sheet web được chuyển thành modal native.">
          <PrimaryButton title="Đóng" tone="ghost" onPress={() => setMissionOpen(false)} />
          {missionsLoading ? <EmptyState title="Đang tải nhiệm vụ..." /> : null}
          {missions?.length ? missions.map((mission) => (
            <Card key={mission.id}>
              <View style={styles.modalRow}>
                <View style={styles.flex}>
                  <Text style={styles.featureTitle}>{mission.title || 'Nhiệm vụ'}</Text>
                  <Text style={styles.featureSubtitle}>{mission.description || 'Hoàn thành hoạt động để nhận XP.'}</Text>
                </View>
                <Pressable onPress={() => setMissionOpen(false)}><X size={18} color={colors.muted} /></Pressable>
              </View>
              <Tag tone={mission.claimed ? 'green' : 'blue'}>{mission.claimed ? 'Đã nhận' : `${mission.reward_xp || 0} XP`}</Tag>
              {!mission.claimed ? <PrimaryButton title="Nhận thưởng" onPress={() => claimMission(mission.id)} tone="blue" /> : null}
            </Card>
          )) : <EmptyState title="Chưa có nhiệm vụ" body="API /missions chưa trả về dữ liệu cho tài khoản này." />}
        </AppScreen>
      </Modal>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  heroTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: font.heavy,
  },
  heroBody: {
    color: colors.muted,
    lineHeight: 21,
    fontWeight: font.medium,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: '#f7fee7',
    padding: spacing.md,
  },
  statValue: {
    color: colors.green,
    fontSize: 24,
    fontWeight: font.heavy,
  },
  statLabel: {
    color: colors.muted,
    fontWeight: font.bold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  feature: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: font.heavy,
  },
  featureSubtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: font.medium,
  },
  praiseList: {
    gap: spacing.sm,
  },
  modalRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
