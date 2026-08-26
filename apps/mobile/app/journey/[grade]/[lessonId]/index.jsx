import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Card,
  ErrorState,
  GhostButton,
  LoadingState,
  Pill,
  ProgressBar,
  Screen
} from "../../../../components/ui/Primitives";
import LessonPlayer from "../../../../components/journey/LessonPlayer";
import { colors, spacing, typography } from "../../../../constants/theme";
import { useAuth } from "../../../../context/AuthContext";
import { learningApi } from "../../../../services/api";
import { useApiResource } from "../../../../hooks/useApiResource";

const levels = ["level1", "level2", "level3"];

export default function LessonDetailScreen() {
  const { lessonId, grade } = useLocalSearchParams();
  const { token, user, refreshProfile } = useAuth();
  const lessonKey = Array.isArray(lessonId) ? lessonId[0] : lessonId;
  const gradeKey = Array.isArray(grade) ? grade[0] : grade;
  const lessonResource = useApiResource(async () => {
    const [lesson, lessons] = await Promise.all([
      learningApi.lesson(lessonKey),
      learningApi.bai_hoc({ classId: Number(gradeKey) })
    ]);
    return { lesson, lessons };
  }, [gradeKey, lessonKey]);
  const lesson = lessonResource.data?.lesson;
  const gradeLessons = lessonResource.data?.lessons || [];
  const lessonStars = user?.balancingProgress?.lessonStars?.[lessonKey] || {};
  const completedLevels = levels.filter((level) => lessonStars[level] > 0).length;
  const lessonIndex = gradeLessons.findIndex((item) => String(item.lessonId || item.id) === String(lessonKey));
  const previousLesson = lessonIndex > 0 ? gradeLessons[lessonIndex - 1] : null;
  const previousStars = previousLesson
    ? user?.balancingProgress?.lessonStars?.[previousLesson.lessonId || previousLesson.id] || {}
    : null;
  const isUnlocked = user?.role === "admin"
    || user?.role === "teacher"
    || (lessonIndex === 0 && (
      ["6", "7", "8"].includes(String(gradeKey))
      || user?.balancingProgress?.passedGrades?.includes(String(gradeKey))
      || (user?.balancingProgress?.placement?.status === "placed"
        && String(user.balancingProgress.placement.assignedGrade) === String(gradeKey))
    ))
    || (previousStars && levels.every((level) => Number(previousStars[level] || 0) > 0))
    || levels.every((level) => Number(lessonStars[level] || 0) > 0);

  const saveLevel = async (level) => {
    try {
      await learningApi.completeLessonSegment(token, { lessonId: lessonKey, level, stars: 1 });
      await refreshProfile();
      const nextCompletedLevels = completedLevels + (lessonStars[level] > 0 ? 0 : 1);
      Alert.alert("Đã ghi nhận", `Bạn hoàn thành ${nextCompletedLevels}/3 chặng của bài học.`);
    } catch (error) {
      Alert.alert("Chưa lưu được tiến độ", error.message);
      throw error;
    }
  };

  if (lessonResource.loading && !lesson) return <LoadingState label="Đang chuẩn bị bài học..." />;
  if (lessonResource.error || !lesson) {
    return (
      <Screen>
        <ErrorState message={lessonResource.error?.message || "Không tìm thấy bài học."} onRetry={lessonResource.reload} />
        <GhostButton label="Quay lại lộ trình" icon="arrow-back-outline" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (!isUnlocked) {
    return (
      <Screen>
        <Card style={styles.lockedCard}>
          <Text style={styles.lockedIcon}>🔒</Text>
          <Text style={styles.lockedTitle}>Chặng này chưa được mở</Text>
          <Text style={styles.lockedText}>Hoàn thành đủ 3 vòng của chặng trước để tiếp tục hành trình.</Text>
        </Card>
        <GhostButton label="Quay lại lộ trình" icon="arrow-back-outline" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.page}>
      <View style={styles.lessonHero}>
        <View style={styles.heroTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Quay lại lộ trình">
            <Ionicons name="arrow-back" size={21} color="#ffffff" />
          </Pressable>
          <View style={styles.heroPill}><Ionicons name="compass-outline" size={15} color="#fde68a" /><Text style={styles.heroPillText}>Lộ trình khối {gradeKey}</Text></View>
          <View style={styles.heroStar}><Ionicons name="star" size={18} color="#fbbf24" /><Text style={styles.heroStarText}>{completedLevels}/3</Text></View>
        </View>
        <Text style={styles.heroEyebrow}>Nhiệm vụ học tập</Text>
        <Text style={styles.heroTitle}>{lesson.title || "Bài học"}</Text>
        <Text style={styles.heroDescription}>{lesson.description || lesson.chapter || lesson.chapterName || "Học theo từng chặng để nắm chắc kiến thức."}</Text>
        <View style={styles.heroMetrics}>
          <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>3</Text><Text style={styles.heroMetricLabel}>Vòng học</Text></View>
          <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{completedLevels}</Text><Text style={styles.heroMetricLabel}>Đã xong</Text></View>
          <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{Math.round((completedLevels / 3) * 100)}%</Text><Text style={styles.heroMetricLabel}>Tiến độ</Text></View>
        </View>
      </View>

      <Card accent={colors.green} style={styles.progressCard}>
        <View style={styles.progressTop}>
          <View>
            <Text style={styles.progressTitle}>Tiến độ bài học</Text>
            <Text style={styles.progressSubtitle}>{completedLevels}/3 chặng đã đạt yêu cầu</Text>
          </View>
          <Pill label={`${completedLevels}/3 sao`} color={colors.green} icon="star-outline" />
        </View>
        <ProgressBar value={completedLevels / 3} color={colors.green} />
      </Card>

      <LessonPlayer lesson={lesson} lessonStars={lessonStars} onCompleteLevel={saveLevel} />

      <GhostButton label="Quay lại lộ trình" icon="arrow-back-outline" color={colors.ink} onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { paddingTop: spacing.sm },
  lessonHero: { backgroundColor: "#0f172a", borderBottomColor: "#020617", borderBottomWidth: 7, borderRadius: 24, gap: spacing.sm, overflow: "hidden", padding: spacing.lg },
  heroTop: { alignItems: "center", flexDirection: "row", gap: spacing.sm, justifyContent: "space-between" },
  backButton: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.12)", borderRadius: 13, borderWidth: 1, height: 42, justifyContent: "center", width: 42 },
  heroPill: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.09)", borderRadius: 999, flexDirection: "row", gap: 6, paddingHorizontal: 11, paddingVertical: 8 },
  heroPillText: { color: "#fde68a", fontFamily: typography.bold, fontSize: 10, textTransform: "uppercase" },
  heroStar: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.09)", borderRadius: 13, flexDirection: "row", gap: 4, paddingHorizontal: 10, paddingVertical: 9 },
  heroStarText: { color: "#ffffff", fontFamily: typography.bold, fontSize: 11 },
  heroEyebrow: { color: "#fbbf24", fontFamily: typography.bold, fontSize: 10, letterSpacing: 1.5, marginTop: spacing.sm, textTransform: "uppercase" },
  heroTitle: { color: "#ffffff", fontFamily: typography.bold, fontSize: 28, lineHeight: 35 },
  heroDescription: { color: "#cbd5e1", fontFamily: typography.medium, fontSize: 14, lineHeight: 22 },
  heroMetrics: { flexDirection: "row", gap: 8, marginTop: spacing.sm },
  heroMetric: { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.1)", borderRadius: 13, borderWidth: 1, flex: 1, gap: 2, padding: 10 },
  heroMetricValue: { color: "#ffffff", fontFamily: typography.bold, fontSize: 18 },
  heroMetricLabel: { color: "#94a3b8", fontFamily: typography.bold, fontSize: 8, letterSpacing: 0.6, textTransform: "uppercase" },
  progressCard: { gap: spacing.md },
  progressTop: { alignItems: "center", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  progressTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 18 },
  progressSubtitle: { color: colors.muted, fontFamily: typography.medium, fontSize: 13, marginTop: 3 },
  lockedCard: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xl },
  lockedIcon: { fontSize: 44 },
  lockedTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 21, textAlign: "center" },
  lockedText: { color: colors.muted, fontFamily: typography.medium, fontSize: 14, lineHeight: 21, textAlign: "center" }
});
