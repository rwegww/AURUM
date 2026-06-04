import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
  ScreenHeader,
  SectionTitle
} from "../../components/ui/Primitives";
import { colors, radius, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { learningApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";

const grades = ["8", "9", "10", "11", "12"];

const getLessonStars = (user, lessonId) => {
  const stars = user?.balancingProgress?.lessonStars?.[lessonId] || {};
  return {
    total: (stars.level1 || 0) + (stars.level2 || 0) + (stars.level3 || 0),
    completedLevels: ["level1", "level2", "level3"].filter((level) => stars[level] > 0).length
  };
};

export default function JourneyTab() {
  const { user } = useAuth();
  const defaultGrade = String(user?.studyPlan?.grade || "10");
  const [grade, setGrade] = React.useState(grades.includes(defaultGrade) ? defaultGrade : "10");

  const bai_hocResource = useApiResource(
    () => learningApi.bai_hoc({ classId: Number(grade) }),
    [grade]
  );

  const bai_hoc = bai_hocResource.data || [];
  const completedCount = bai_hoc.filter((lesson) => getLessonStars(user, lesson.id).completedLevels >= 3).length;
  const overall = bai_hoc.length ? completedCount / bai_hoc.length : 0;

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Lộ trình"
        title="Lộ trình hóa học"
        subtitle="Theo dõi bài học từ khối 8 đến 12 và ghi nhận tiến độ từng chặng."
      />

      <Card accent={colors.green} style={styles.summary}>
        <View style={styles.summaryTop}>
          <View>
            <Text style={styles.summaryTitle}>Khối {grade}</Text>
            <Text style={styles.summarySubtitle}>{completedCount}/{bai_hoc.length || 0} bài đã hoàn thành đủ 3 chặng</Text>
          </View>
          <Text style={styles.summaryPercent}>{Math.round(overall * 100)}%</Text>
        </View>
        <ProgressBar value={overall} color={colors.green} />
      </Card>

      <View style={styles.gradeRow}>
        {grades.map((item) => {
          const active = grade === item;
          return (
            <Pressable
              key={item}
              onPress={() => setGrade(item)}
              style={[styles.gradeChip, active ? styles.gradeChipActive : null]}
            >
              <Text style={[styles.gradeText, active ? styles.gradeTextActive : null]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle title={`Bài học khối ${grade}`} actionLabel="Tải lại" onAction={bai_hocResource.reload} />

      {bai_hocResource.loading && !bai_hocResource.data ? (
        <LoadingState label="Đang tải bài học..." />
      ) : bai_hocResource.error ? (
        <ErrorState message={bai_hocResource.error.message} onRetry={bai_hocResource.reload} />
      ) : bai_hoc.length === 0 ? (
        <EmptyState title="Chưa có bài học" subtitle="Hệ thống chưa có dữ liệu cho khối này." />
      ) : (
        <View style={styles.lessonStack}>
          {bai_hoc.map((lesson, index) => {
            const starData = getLessonStars(user, lesson.id);
            return (
              <Pressable
                key={lesson.id}
                onPress={() => router.push({ pathname: "/journey/[grade]/[lessonId]", params: { grade, lessonId: lesson.id } })}
                style={({ pressed }) => [styles.lessonCard, pressed ? styles.lessonPressed : null]}
              >
                <View style={styles.lessonIndex}>
                  <Text style={styles.lessonIndexText}>{lesson.order || index + 1}</Text>
                </View>
                <View style={styles.lessonContent}>
                  <Text style={styles.lessonTitle} numberOfLines={2}>{lesson.title}</Text>
                  <Text style={styles.lessonMeta} numberOfLines={1}>
                    {lesson.chapter || "Chương học"} · {starData.total}/9 sao
                  </Text>
                  <ProgressBar value={starData.completedLevels / 3} color={starData.completedLevels >= 3 ? colors.green : colors.green} />
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    gap: spacing.md
  },
  summaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md
  },
  summaryTitle: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: "900"
  },
  summarySubtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4
  },
  summaryPercent: {
    color: colors.green,
    fontSize: 28,
    fontWeight: "900"
  },
  gradeRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  gradeChip: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  gradeChipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink
  },
  gradeText: {
    color: colors.ink,
    fontWeight: "900"
  },
  gradeTextActive: {
    color: "#ffffff"
  },
  lessonStack: {
    gap: spacing.sm
  },
  lessonCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.md
  },
  lessonPressed: {
    backgroundColor: colors.surfaceAlt
  },
  lessonIndex: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center"
  },
  lessonIndexText: {
    color: colors.green,
    fontSize: 16,
    fontWeight: "900"
  },
  lessonContent: {
    flex: 1,
    gap: spacing.sm
  },
  lessonTitle: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900"
  },
  lessonMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  }
});


