import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import {
  Card,
  EmptyState,
  ErrorState,
  ListRow,
  LoadingState,
  Pill,
  PrimaryButton,
  Screen,
  ScreenHeader,
  SectionTitle,
  TextField
} from "../../components/ui/Primitives";
import { colors, radius, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { classApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";

const getGrade = (item) => item.khoi_id || item.gradeLevelId || item.gradeLevel || "?";

const postTypeLabel = (type) => {
  if (type === "assignment") return "BÃ i táº­p";
  if (type === "video") return "Video";
  return "BÃ i Ä‘Äƒng";
};

export default function ClassroomTab() {
  const { token } = useAuth();
  const [joinCode, setJoinCode] = React.useState("");
  const [joining, setJoining] = React.useState(false);

  const resource = useApiResource(async () => {
    const lop = await classApi.list(token).catch(() => []);
    const previews = await Promise.all(
      lop.slice(0, 3).map(async (item) => {
        const posts = await classApi.posts(token, item.id).catch(() => []);
        const schedules = await classApi.schedules(token, item.id).catch(() => []);
        return { classId: item.id, posts, schedules };
      })
    );
    return { lop, previews };
  }, [token]);

  const joinClass = async () => {
    if (!joinCode.trim()) return;
    setJoining(true);
    try {
      await classApi.join(token, joinCode.trim().toUpperCase());
      setJoinCode("");
      Alert.alert("ÄÃ£ tham gia lá»›p", "Lá»›p há»c Ä‘Ã£ Ä‘Æ°á»£c thÃªm vÃ o danh sÃ¡ch.");
      await resource.reload();
    } catch (error) {
      Alert.alert("KhÃ´ng tham gia Ä‘Æ°á»£c", error.message);
    } finally {
      setJoining(false);
    }
  };

  if (resource.loading && !resource.data) {
    return <LoadingState label="Äang táº£i lá»›p há»c..." />;
  }

  const lop = resource.data?.lop || [];
  const previews = resource.data?.previews || [];
  const assignmentCount = previews.reduce((total, item) => (
    total + item.posts.filter((post) => post.type === "assignment" && !post.is_completed).length
  ), 0);
  const scheduleCount = previews.reduce((total, item) => total + item.schedules.length, 0);

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Lá»›p há»c"
        title="Lá»›p há»c"
        subtitle="Trung tÃ¢m theo dÃµi lá»›p Ä‘Ã£ tham gia, bÃ i giÃ¡o viÃªn giao vÃ  lá»‹ch há»c."
        color={colors.green}
        right={<Pill label={`${lop.length} lá»›p`} icon="school-outline" color={colors.green} />}
      />

      {resource.error ? (
        <ErrorState message={resource.error.message} onRetry={resource.reload} />
      ) : null}

      <Card accent={colors.green} style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryTitle}>Lá»›p há»c lÃ  trung tÃ¢m</Text>
            <Text style={styles.summaryText}>Æ¯u tiÃªn xem thÃ´ng bÃ¡o, bÃ i táº­p vÃ  lá»‹ch há»c trÆ°á»›c khi má»Ÿ cÃ¡c cÃ´ng cá»¥ khÃ¡c.</Text>
          </View>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryIconText}>{lop.length}</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{assignmentCount}</Text>
            <Text style={styles.statLabel}>bÃ i chÆ°a xong</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{scheduleCount}</Text>
            <Text style={styles.statLabel}>lá»‹ch há»c</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.joinCard}>
        <Text style={styles.cardTitle}>Tham gia lá»›p má»›i</Text>
        <View style={styles.joinRow}>
          <TextField
            icon="key-outline"
            placeholder="MÃ£ lá»›p"
            value={joinCode}
            onChangeText={setJoinCode}
            autoCapitalize="characters"
            style={styles.joinInput}
          />
          <PrimaryButton
            label={joining ? "Äang vÃ o..." : "VÃ o lá»›p"}
            icon="enter-outline"
            color={colors.green}
            onPress={joinClass}
            disabled={joining}
            style={styles.joinButton}
          />
        </View>
      </Card>

      <SectionTitle title="Lá»›p cá»§a tÃ´i" actionLabel="Táº£i láº¡i" onAction={resource.reload} color={colors.green} />
      {lop.length > 0 ? (
        <View style={styles.stack}>
          {lop.map((item) => {
            const preview = previews.find((entry) => entry.classId === item.id);
            const latestPost = preview?.posts?.[0];
            return (
              <Pressable key={item.id} onPress={() => router.push(`/classroom/${item.id}`)}>
                <Card style={styles.classCard} accent={colors.green}>
                  <View style={styles.classTop}>
                    <View style={styles.classTitleBlock}>
                      <Text style={styles.className}>{item.name}</Text>
                      <Text style={styles.classMeta}>
                        Khá»‘i {getGrade(item)} Â· {item.student_count || 0} há»c sinh
                      </Text>
                    </View>
                    <Pill label={item.code || "Lá»›p"} icon="key-outline" color={colors.green} />
                  </View>
                  {latestPost ? (
                    <View style={styles.latestBox}>
                      <Text style={styles.latestLabel}>Má»›i nháº¥t</Text>
                      <Text style={styles.latestText} numberOfLines={2}>{latestPost.content}</Text>
                    </View>
                  ) : (
                    <Text style={styles.classMeta}>ChÆ°a cÃ³ bÃ i Ä‘Äƒng má»›i.</Text>
                  )}
                </Card>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <EmptyState
          icon="school-outline"
          title="ChÆ°a tham gia lá»›p"
          subtitle="Nháº­p mÃ£ lá»›p giÃ¡o viÃªn cung cáº¥p Ä‘á»ƒ báº¯t Ä‘áº§u theo dÃµi bÃ i táº­p vÃ  lá»‹ch há»c."
        />
      )}

      <SectionTitle title="BÃ i gáº§n Ä‘Ã¢y" color={colors.green} />
      {previews.some((item) => item.posts.length > 0) ? (
        <View style={styles.stack}>
          {previews.flatMap((item) => item.posts.slice(0, 2).map((post) => ({
            ...post,
            classId: item.classId,
            className: lop.find((cls) => cls.id === item.classId)?.name
          }))).slice(0, 5).map((post) => (
            <ListRow
              key={post.id}
              icon={post.type === "assignment" ? "clipboard-outline" : "chatbubble-text-outline"}
              title={post.content}
              subtitle={`${post.className || "Lá»›p há»c"} Â· ${postTypeLabel(post.type)}`}
              color={post.type === "assignment" ? colors.green : colors.green}
              onPress={() => router.push(`/classroom/${post.classId}`)}
            />
          ))}
        </View>
      ) : (
        <EmptyState icon="chatbubbles-outline" title="ChÆ°a cÃ³ bÃ i Ä‘Äƒng" subtitle="ThÃ´ng bÃ¡o vÃ  bÃ i táº­p sáº½ xuáº¥t hiá»‡n khi giÃ¡o viÃªn Ä‘Äƒng trong lá»›p." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    gap: spacing.md
  },
  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  summaryCopy: {
    flex: 1
  },
  summaryTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "900"
  },
  summaryText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
    marginTop: 4
  },
  summaryIcon: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center"
  },
  summaryIconText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900"
  },
  statRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  statBox: {
    flex: 1,
    backgroundColor: "#eef8ff",
    borderRadius: radius.md,
    padding: spacing.md
  },
  statValue: {
    color: colors.green,
    fontSize: 24,
    fontWeight: "900"
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  joinCard: {
    gap: spacing.md
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900"
  },
  joinRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  joinInput: {
    flex: 1
  },
  joinButton: {
    width: 86
  },
  stack: {
    gap: spacing.sm
  },
  classCard: {
    gap: spacing.md
  },
  classTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md
  },
  classTitleBlock: {
    flex: 1,
    gap: 4
  },
  className: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900"
  },
  classMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  latestBox: {
    backgroundColor: "#f7fbff",
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4
  },
  latestLabel: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  latestText: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700"
  }
});


