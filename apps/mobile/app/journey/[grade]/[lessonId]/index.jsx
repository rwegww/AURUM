import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Card,
  ErrorState,
  GhostButton,
  IconButton,
  LoadingState,
  Pill,
  ProgressBar,
  Screen,
  ScreenHeader
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
  const lessonResource = useApiResource(() => learningApi.lesson(lessonKey), [lessonKey]);
  const lesson = lessonResource.data;
  const lessonStars = user?.balancingProgress?.lessonStars?.[lessonKey] || {};
  const completedLevels = levels.filter((level) => lessonStars[level] > 0).length;

  const saveLevel = async (level, stars) => {
    try {
      await learningApi.completeLessonSegment(token, { lessonId: lessonKey, level, stars });
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

  return (
    <Screen>
      <ScreenHeader
        eyebrow={`Lộ trình khối ${gradeKey}`}
        title={lesson.title || "Bài học"}
        subtitle={lesson.description || lesson.chapter || lesson.chapterName || "Học theo từng chặng để nắm chắc kiến thức."}
        right={<IconButton icon="arrow-back-outline" onPress={() => router.back()} />}
      />

      <Card accent={colors.green} style={styles.progressCard}>
        <View style={styles.progressTop}>
          <View>
            <Text style={styles.progressTitle}>Tiến độ bài học</Text>
            <Text style={styles.progressSubtitle}>{completedLevels}/3 chặng đã đạt yêu cầu</Text>
          </View>
          <Pill label={`${Object.values(lessonStars).reduce((sum, value) => sum + (value || 0), 0)}/9 sao`} color={colors.green} icon="star-outline" />
        </View>
        <ProgressBar value={completedLevels / 3} color={colors.green} />
      </Card>

      <LessonPlayer lesson={lesson} lessonStars={lessonStars} onCompleteLevel={saveLevel} />

      <GhostButton label="Quay lại lộ trình" icon="arrow-back-outline" color={colors.ink} onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressCard: { gap: spacing.md },
  progressTop: { alignItems: "center", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  progressTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 18 },
  progressSubtitle: { color: colors.muted, fontFamily: typography.medium, fontSize: 13, marginTop: 3 }
});
