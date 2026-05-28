import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
  { title: "Lá»™ trÃ¬nh", subtitle: "BÃ i há»c theo khá»‘i 8-12", icon: "map-outline", color: colors.green, href: "/journey" },
  { title: "CÃ´ng cá»¥", subtitle: "Gá»£i Ã½ cÃ´ng thá»©c, mÃ¡y tÃ­nh hÃ³a há»c", icon: "construct-outline", color: colors.green, href: "/lab" },
  { title: "Äáº¥u trÆ°á»ng", subtitle: "Äáº¥u nhanh báº±ng cÃ¢u há»i hÃ³a", icon: "trophy-outline", color: colors.green, href: "/arena" },
  { title: "TÃ i liá»‡u", subtitle: "ThÆ° viá»‡n há»c liá»‡u", icon: "library-outline", color: colors.green, href: "/library" }
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
    setClaimingId(missionId);
    await learningApi.claimMission(token, missionId).catch(() => null);
    await Promise.all([dashboard.reload(), refreshProfile()]);
    setClaimingId(null);
  };

  if (dashboard.loading && !dashboard.data) {
    return <LoadingState label="Äang má»Ÿ báº£ng Ä‘iá»u khiá»ƒn..." />;
  }

  const lop = dashboard.data?.lop || [];
  const nhiem_vu = dashboard.data?.nhiem_vu || [];
  const leaderboard = dashboard.data?.leaderboard || [];
  const activeMissions = nhiem_vu.filter((mission) => !mission.isClaimed).slice(0, 3);

  return (
    <Screen>
      <ScreenHeader
        eyebrow="á»¨ng dá»¥ng AURUM"
        title={`ChÃ o ${user?.username || "báº¡n"}`}
        subtitle="Táº­p trung vÃ o bÃ i tiáº¿p theo, giá»¯ chuá»—i há»c vÃ  má»Ÿ khÃ³a thÃªm pháº£n á»©ng."
        right={<Pill icon="flame-outline" label={`${user?.streakCount || 0} ngÃ y`} color={colors.green} />}
      />

      <Card accent={colors.green} style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{user?.level || 1}</Text>
            <Text style={styles.levelLabel}>Cáº¥p</Text>
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Tiáº¿n trÃ¬nh hÃ´m nay</Text>
            <Text style={styles.heroSubtitle}>
              {user?.todayLessonCompleted
                ? "Báº¡n Ä‘Ã£ hoÃ n thÃ nh má»¥c tiÃªu bÃ i há»c trong ngÃ y."
                : "HoÃ n thÃ nh má»™t cháº·ng há»c Ä‘á»ƒ nháº­n Ä‘iá»ƒm kinh nghiá»‡m vÃ  giá»¯ nhá»‹p há»c."}
            </Text>
          </View>
        </View>
        <ProgressBar value={xpProgress(user?.xp)} color={colors.green} />
        <View style={styles.metricRow}>
          <Metric label="Kinh nghiá»‡m" value={user?.xp || 0} icon="flash-outline" color={colors.green} />
          <Metric label="Trá»±c tuyáº¿n" value={`${user?.todayOnlineMinutes || 0}p`} icon="time-outline" color={colors.green} />
          <Metric label="Äáº¥u trÆ°á»ng" value={user?.arenaStats?.points || 0} icon="trophy-outline" color={colors.green} />
        </View>
      </Card>

      <SectionTitle title="Äi nhanh" />
      <View style={styles.moduleGrid}>
        {moduleCards.map((item) => (
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

      <SectionTitle title="Nhiá»‡m vá»¥" actionLabel="Táº£i láº¡i" onAction={dashboard.reload} />
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
                    <Text style={styles.missionTitle}>{mission.title || mission.name || "Nhiá»‡m vá»¥"}</Text>
                    <Text style={styles.missionDesc} numberOfLines={2}>
                      {mission.description || "HoÃ n thÃ nh má»¥c tiÃªu Ä‘á»ƒ nháº­n Ä‘iá»ƒm kinh nghiá»‡m."}
                    </Text>
                  </View>
                  <Pill label={`+${mission.xp_reward || mission.xpReward || 0} Ä‘iá»ƒm`} color={colors.green} />
                </View>
                <ProgressBar value={current / target} color={completed ? colors.green : colors.green} />
                <View style={styles.missionBottom}>
                  <Text style={styles.progressText}>{Math.min(current, target)}/{target}</Text>
                  {completed ? (
                    <PrimaryButton
                      label={claimingId === mission.id ? "Äang nháº­n" : "Nháº­n thÆ°á»Ÿng"}
                      icon="gift-outline"
                      onPress={() => claimMission(mission.id)}
                      disabled={claimingId === mission.id}
                      style={styles.smallButton}
                    />
                  ) : null}
                </View>
              </Card>
            );
          })}
        </View>
      ) : (
        <EmptyState title="KhÃ´ng cÃ³ nhiá»‡m vá»¥ má»›i" subtitle="Khi hoÃ n thÃ nh bÃ i há»c, cÃ´ng cá»¥ há»— trá»£ hoáº·c Ä‘áº¥u trÆ°á»ng, nhiá»‡m vá»¥ sáº½ cáº­p nháº­t táº¡i Ä‘Ã¢y." />
      )}

      <SectionTitle title="Lá»›p cá»§a tÃ´i" actionLabel="Má»Ÿ" onAction={() => router.push("/profile")} />
      {lop.length > 0 ? (
        <View style={styles.stack}>
          {lop.slice(0, 2).map((item) => (
            <ListRow
              key={item.id}
              icon="people-outline"
              title={item.name}
              subtitle={`Khá»‘i ${item.khoi_id || item.gradeLevelId || item.gradeLevel || "?"} Â· ${item.student_count || 0} há»c sinh`}
              onPress={() => router.push(`/classroom/${item.id}`)}
              color={colors.green}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="people-outline"
          title="ChÆ°a tham gia lá»›p"
          subtitle="Báº¡n cÃ³ thá»ƒ nháº­p mÃ£ lá»›p á»Ÿ mÃ n Há»“ sÆ¡ Ä‘á»ƒ theo dÃµi bÃ i táº­p giÃ¡o viÃªn giao."
        />
      )}

      <SectionTitle title="Báº£ng xáº¿p háº¡ng kinh nghiá»‡m" />
      <View style={styles.stack}>
        {leaderboard.slice(0, 5).map((student, index) => (
          <ListRow
            key={`${student.username}-${index}`}
            icon={index === 0 ? "medal-outline" : "person-outline"}
            title={`${index + 1}. ${student.username}`}
            subtitle={`Cáº¥p ${student.level || 1} Â· ${student.xp || 0} Ä‘iá»ƒm`}
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
  moduleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  moduleCard: {
    width: "47.7%",
    minHeight: 154,
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

