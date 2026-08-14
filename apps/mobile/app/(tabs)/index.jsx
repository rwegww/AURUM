import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  EmptyState,
  ErrorState,
  ListRow,
  LoadingState,
  Metric,
  Pill,
  PrimaryButton,
  ProgressBar,
  Screen,
  ScreenHeader,
  SectionTitle
} from "../../components/ui/Primitives";
import { colors, radius, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { classApi, learningApi, publicApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";

const moduleCards = [
  { title: "Lộ trình", subtitle: "Bài học theo khối 8-12", icon: "map-outline", color: colors.green, href: "/journey" },
  { title: "Công cụ", subtitle: "Gợi ý công thức, máy tính hóa học", icon: "construct-outline", color: colors.green, href: "/lab" },
  { title: "Đấu trường", subtitle: "Đấu nhanh bằng câu hỏi hóa", icon: "trophy-outline", color: colors.green, href: "/arena" },
  { title: "Tài liệu", subtitle: "Thư viện học liệu", icon: "library-outline", color: colors.green, href: "/library" }
];

const xpProgress = (xp = 0) => {
  const currentLevelXp = xp % 1000;
  return currentLevelXp / 1000;
};

export default function HomeTab() {
  const { user, token, refreshProfile } = useAuth();
  const [claimingId, setClaimingId] = React.useState(null);

  const dashboard = useApiResource(async () => {
    const [lop, nhiem_vu, leaderboard] = await Promise.all([
      classApi.list(token).catch(() => []),
      learningApi.nhiem_vu(token).catch(() => []),
      publicApi.leaderboard().catch(() => [])
    ]);
    return { lop, nhiem_vu, leaderboard };
  }, [token]);

  const claimMission = async (missionId) => {
    if (claimingId) return;
    setClaimingId(missionId);
    try {
      await learningApi.claimMission(token, missionId);
      await Promise.all([dashboard.reload(), refreshProfile()]);
    } catch (error) {
      Alert.alert("Chưa nhận được thưởng", error.message || "Vui lòng thử lại sau.");
    } finally {
      setClaimingId(null);
    }
  };

  if (dashboard.loading && !dashboard.data) {
    return <LoadingState label="Đang mở bảng điều khiển..." />;
  }

  const lop = dashboard.data?.lop || [];
  const nhiem_vu = dashboard.data?.nhiem_vu || [];
  const leaderboard = dashboard.data?.leaderboard || [];
  const activeMissions = nhiem_vu.filter((mission) => !mission.isClaimed).slice(0, 3);

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Ứng dụng AURUM"
        title={`Chào ${user?.username || "bạn"}`}
        subtitle="Tập trung vào bài tiếp theo, giữ chuỗi học và mở khóa thêm phản ứng."
        right={<Pill icon="flame-outline" label={`${user?.streakCount || 0} ngày`} color={colors.green} />}
      />

      <Card accent={colors.green} style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{user?.level || 1}</Text>
            <Text style={styles.levelLabel}>Cấp</Text>
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Tiến trình hôm nay</Text>
            <Text style={styles.heroSubtitle}>
              {user?.todayLessonCompleted
                ? "Bạn đã hoàn thành mục tiêu bài học trong ngày."
                : "Hoàn thành một chặng học để nhận điểm kinh nghiệm và giữ nhịp học."}
            </Text>
          </View>
        </View>
        <ProgressBar value={xpProgress(user?.xp)} color={colors.green} />
        <View style={styles.metricRow}>
          <Metric label="Kinh nghiệm" value={user?.xp || 0} icon="flash-outline" color={colors.green} />
          <Metric label="Trực tuyến" value={`${user?.todayOnlineMinutes || 0}p`} icon="time-outline" color={colors.green} />
          <Metric label="Đấu trường" value={user?.arenaStats?.points || 0} icon="trophy-outline" color={colors.green} />
        </View>
      </Card>

      <SectionTitle title="Đi nhanh" />
      <View style={styles.gridStack}>
        <View style={styles.gridRow}>
          {moduleCards.slice(0, 2).map((item) => (
            <Pressable
              key={item.title}
              onPress={() => router.push(item.href)}
              style={({ pressed }) => [
                styles.moduleCard,
                pressed ? { transform: [{ translateY: 2 }] } : null
              ]}
            >
              <View style={[styles.moduleIcon, { backgroundColor: `${item.color}18` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.moduleTitle}>{item.title}</Text>
              <Text style={styles.moduleSubtitle}>{item.subtitle}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.gridRow}>
          {moduleCards.slice(2, 4).map((item) => (
            <Pressable
              key={item.title}
              onPress={() => router.push(item.href)}
              style={({ pressed }) => [
                styles.moduleCard,
                pressed ? { transform: [{ translateY: 2 }] } : null
              ]}
            >
              <View style={[styles.moduleIcon, { backgroundColor: `${item.color}18` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.moduleTitle}>{item.title}</Text>
              <Text style={styles.moduleSubtitle}>{item.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <SectionTitle title="Nhiệm vụ" actionLabel="Tải lại" onAction={dashboard.reload} />
      {dashboard.error ? (
        <ErrorState message={dashboard.error.message} onRetry={dashboard.reload} />
      ) : activeMissions.length > 0 ? (
        <View style={styles.stack}>
          {activeMissions.map((mission) => {
            const target = mission.target_count || mission.targetCount || 1;
            const current = mission.currentCount || 0;
            const completed = mission.isCompleted;
            return (
              <Card key={mission.id} style={styles.missionCard}>
                <View style={styles.missionTop}>
                  <View style={styles.missionText}>
                    <Text style={styles.missionTitle}>{mission.title || mission.name || "Nhiệm vụ"}</Text>
                    <Text style={styles.missionDesc} numberOfLines={2}>
                      {mission.description || "Hoàn thành mục tiêu để nhận điểm kinh nghiệm."}
                    </Text>
                  </View>
                  <Pill label={`+${mission.xp_reward || mission.xpReward || 0} điểm`} color={colors.green} />
                </View>
                <ProgressBar value={current / target} color={completed ? colors.green : colors.green} />
                <View style={styles.missionBottom}>
                  <Text style={styles.progressText}>{Math.min(current, target)}/{target}</Text>
                  {completed ? (
                    <PrimaryButton
                      label={claimingId === mission.id ? "Đang nhận" : "Nhận thưởng"}
                      icon="gift-outline"
                      onPress={() => claimMission(mission.id)}
                      disabled={Boolean(claimingId)}
                      style={styles.smallButton}
                    />
                  ) : null}
                </View>
              </Card>
            );
          })}
        </View>
      ) : (
        <EmptyState title="Không có nhiệm vụ mới" subtitle="Khi hoàn thành bài học, công cụ hỗ trợ hoặc đấu trường, nhiệm vụ sẽ cập nhật tại đây." />
      )}

      <SectionTitle title="Lớp của tôi" actionLabel="Mở" onAction={() => router.push("/profile")} />
      {lop.length > 0 ? (
        <View style={styles.stack}>
          {lop.slice(0, 2).map((item) => (
            <ListRow
              key={item.id}
              icon="people-outline"
              title={item.name}
              subtitle={`Khối ${item.khoi_id || item.gradeLevelId || item.gradeLevel || "?"} · ${item.student_count || 0} học sinh`}
              onPress={() => router.push(`/classroom/${item.id}`)}
              color={colors.green}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="people-outline"
          title="Chưa tham gia lớp"
          subtitle="Bạn có thể nhập mã lớp ở màn Hồ sơ để theo dõi bài tập giáo viên giao."
        />
      )}

      <SectionTitle title="Bảng xếp hạng kinh nghiệm" />
      <View style={styles.stack}>
        {leaderboard.slice(0, 5).map((student, index) => (
          <ListRow
            key={`${student.username}-${index}`}
            icon={index === 0 ? "medal-outline" : "person-outline"}
            title={`${index + 1}. ${student.username}`}
            subtitle={`Cấp ${student.level || 1} · ${student.xp || 0} điểm`}
            color={index === 0 ? colors.green : colors.green}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    gap: spacing.md
  },
  heroTop: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center"
  },
  levelBadge: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center"
  },
  levelNumber: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900"
  },
  levelLabel: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  heroCopy: {
    flex: 1,
    gap: 4
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "900"
  },
  heroSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600"
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  gridStack: {
    gap: spacing.md
  },
  gridRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  moduleCard: {
    flex: 1,
    minHeight: 140,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center"
  },
  moduleTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  moduleSubtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700"
  },
  stack: {
    gap: spacing.sm
  },
  missionCard: {
    gap: spacing.md
  },
  missionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  missionText: {
    flex: 1,
    gap: 4
  },
  missionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  missionDesc: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600"
  },
  missionBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  progressText: {
    color: colors.muted,
    fontWeight: "900"
  },
  smallButton: {
    minHeight: 42,
    paddingHorizontal: 12
  }
});

