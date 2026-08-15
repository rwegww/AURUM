import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  ProgressBar,
  Pill,
  Screen,
  ScreenHeader,
  SectionTitle
} from "../../components/ui/Primitives";
import { colors, radius, spacing, typography } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { learningApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";

const grades = ["6", "7", "8", "9", "10", "11", "12"];

const getLessonStars = (user, lessonId) => {
  const stars = user?.balancingProgress?.lessonStars?.[lessonId] || {};
  return {
    total: (stars.level1 || 0) + (stars.level2 || 0) + (stars.level3 || 0),
    completedLevels: ["level1", "level2", "level3"].filter((level) => stars[level] > 0).length
  };
};

export default function JourneyTab() {
  const { user } = useAuth();
  const confirmedGrade = String(user?.balancingProgress?.placement?.assignedGrade || "");
  const availableGrades = user?.balancingProgress?.placement?.required && grades.includes(confirmedGrade)
    ? [confirmedGrade]
    : grades;
  const defaultGrade = String(confirmedGrade || user?.studyPlan?.grade || "10");
  const [grade, setGrade] = React.useState(availableGrades.includes(defaultGrade) ? defaultGrade : availableGrades[0]);

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
        subtitle="Theo dõi bài học từ khối 6 đến 12 và ghi nhận tiến độ từng chặng."
      />

      <Card accent={colors.green} style={styles.summary}>
        <View style={styles.summaryTop}>
          <View>
            <Pill label={`Lộ trình khối ${grade}`} color={colors.green} icon="map-outline" />
            <Text style={styles.summaryTitle}>Học từng bài, hiểu rồi mới qua chặng</Text>
            <Text style={styles.summarySubtitle}>{completedCount}/{bai_hoc.length || 0} bài đã hoàn thành qua cả 3 phần: đọc hiểu, luyện tập và kiểm tra.</Text>
          </View>
          <Text style={styles.summaryPercent}>{Math.round(overall * 100)}%</Text>
        </View>
        <ProgressBar value={overall} color={colors.green} />
      </Card>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gradeRow}>
        {availableGrades.map((item) => {
          const active = grade === item;
          return (
            <Pressable
              key={item}
              onPress={() => setGrade(item)}
              style={[styles.gradeChip, active ? styles.gradeChipActive : null]}
            >
              <Text style={[styles.gradeText, active ? styles.gradeTextActive : null]}>Khối {item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <SectionTitle title={`Bài học khối ${grade}`} actionLabel="Tải lại" onAction={bai_hocResource.reload} />

      {bai_hocResource.loading && !bai_hocResource.data ? (
        <LoadingState label="Đang tải bài học..." />
      ) : bai_hocResource.error ? (
        <ErrorState message={bai_hocResource.error.message} onRetry={bai_hocResource.reload} />
      ) : bai_hoc.length === 0 ? (
        <EmptyState title="Chưa có bài học" subtitle="Hệ thống chưa có dữ liệu cho khối này." />
      ) : (
        <View style={styles.lessonStack}>
          {bai_hoc.map((lesson) => {
            const starData = getLessonStars(user, lesson.id);
            const isComplete = starData.completedLevels >= 3;
            const moduleCount = lesson.theoryModules?.length || 0;
            const quizCount = Array.isArray(lesson.quizzes)
              ? lesson.quizzes.length
              : Object.values(lesson.quizzes || {}).reduce((total, items) => total + (Array.isArray(items) ? items.length : 0), 0);
            return (
              <Pressable
                key={lesson.id}
                onPress={() => router.push({ pathname: "/journey/[grade]/[lessonId]", params: { grade, lessonId: lesson.id } })}
                style={({ pressed }) => [styles.lessonCard, pressed ? styles.lessonPressed : null]}
              >
                <View style={[styles.lessonIndex, isComplete ? styles.lessonIndexComplete : null]}>
                  <Ionicons name={isComplete ? "checkmark" : "flask-outline"} color={isComplete ? "#ffffff" : colors.greenDark} size={21} />
                </View>
                <View style={styles.lessonContent}>
                  <Text style={styles.lessonTitle} numberOfLines={2}>{lesson.title}</Text>
                  <Text style={styles.lessonMeta} numberOfLines={1}>
                    {lesson.chapter || lesson.chapterName || "Chương học"}
                  </Text>
                  <View style={styles.lessonFacts}>
                    <Text style={styles.lessonFact}><Ionicons name="book-outline" size={13} /> {moduleCount} ý chính</Text>
                    <Text style={styles.lessonFact}><Ionicons name="help-circle-outline" size={13} /> {quizCount} câu tự kiểm</Text>
                  </View>
                  <ProgressBar value={starData.completedLevels / 3} color={starData.completedLevels >= 3 ? colors.green : colors.green} />
                  <Text style={[styles.lessonAction, isComplete ? styles.lessonActionDone : null]}>{isComplete ? "Đã hoàn thành · xem lại bài" : starData.completedLevels ? `Đang học chặng ${starData.completedLevels + 1}/3` : "Bắt đầu học bài này"}</Text>
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
    alignItems: "flex-start",
    gap: spacing.md
  },
  summaryTitle: {
    color: colors.ink,
    fontFamily: typography.bold,
    fontSize: 20,
    lineHeight: 27,
    marginTop: spacing.sm
  },
  summarySubtitle: {
    color: colors.muted,
    fontFamily: typography.medium,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4
  },
  summaryPercent: {
    color: colors.green,
    fontFamily: typography.bold,
    fontSize: 28,
  },
  gradeRow: {
    gap: spacing.sm,
    paddingRight: spacing.md
  },
  gradeChip: {
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 76,
    paddingHorizontal: spacing.md
  },
  gradeChipActive: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  gradeText: {
    color: colors.ink,
    fontFamily: typography.bold,
    fontSize: 13
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
    backgroundColor: "#edf7e5",
    alignItems: "center",
    justifyContent: "center"
  },
  lessonIndexComplete: {
    backgroundColor: colors.green
  },
  lessonContent: {
    flex: 1,
    gap: spacing.sm
  },
  lessonTitle: {
    color: colors.ink,
    fontFamily: typography.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  lessonMeta: {
    color: colors.muted,
    fontFamily: typography.medium,
    fontSize: 12,
  },
  lessonFacts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  lessonFact: {
    color: colors.muted,
    fontFamily: typography.medium,
    fontSize: 11
  },
  lessonAction: {
    color: colors.greenDark,
    fontFamily: typography.bold,
    fontSize: 12
  },
  lessonActionDone: {
    color: colors.green
  }
});


