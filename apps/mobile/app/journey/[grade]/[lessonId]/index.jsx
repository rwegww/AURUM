import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Card,
  GhostButton,
  IconButton,
  LoadingState,
  Pill,
  PrimaryButton,
  ProgressBar,
  Screen,
  ScreenHeader,
  SectionTitle
} from "../../../../components/ui/Primitives";
import { colors, spacing } from "../../../../constants/theme";
import { useAuth } from "../../../../context/AuthContext";
import { learningApi } from "../../../../services/api";
import { useApiResource } from "../../../../hooks/useApiResource";

const levels = [
  { key: "level1", label: "Nhập môn", xp: 30, color: colors.green },
  { key: "level2", label: "Thử thách", xp: 50, color: colors.green },
  { key: "level3", label: "Câu hỏi", xp: 100, color: colors.green }
];

const normalizeModuleTitle = (module, index) => (
  module?.title ||
  module?.heading ||
  module?.name ||
  `Mục lý thuyết ${index + 1}`
);

const toDisplayText = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map((item) => toDisplayText(item)).filter(Boolean).join("\n");
  }
  if (typeof value === "object") {
    return value.text || value.content || value.description || JSON.stringify(value);
  }
  return String(value);
};

export default function LessonDetailScreen() {
  const { lessonId, grade } = useLocalSearchParams();
  const { token, user, refreshProfile } = useAuth();
  const [savingLevel, setSavingLevel] = React.useState(null);
  const lessonKey = Array.isArray(lessonId) ? lessonId[0] : lessonId;
  const gradeKey = Array.isArray(grade) ? grade[0] : grade;

  const lessonResource = useApiResource(
    () => learningApi.lesson(lessonKey),
    [lessonKey]
  );

  const lesson = lessonResource.data;
  const lessonStars = user?.balancingProgress?.lessonStars?.[lessonKey] || {};
  const completedLevels = levels.filter((level) => lessonStars[level.key] > 0).length;

  const completeLevel = async (level) => {
    setSavingLevel(level.key);
    try {
      await learningApi.completeLessonSegment(token, {
        lessonId: lessonKey,
        level: level.key,
        stars: 3
      });
      await refreshProfile();
      Alert.alert("Đã lưu tiến độ", `${level.label} hoàn thành với 3 sao.`);
    } catch (error) {
      Alert.alert("Không lưu được", error.message);
    } finally {
      setSavingLevel(null);
    }
  };

  if (lessonResource.loading && !lesson) {
    return <LoadingState label="Đang tải bài học..." />;
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow={`Khối ${gradeKey}`}
        title={lesson?.title || "Bài học"}
        subtitle={lesson?.description || lesson?.chapter || "Nội dung bài học từ hệ thống AURUM."}
        right={<IconButton icon="arrow-back-outline" onPress={() => router.back()} />}
      />

      <Card accent={colors.green} style={styles.progressCard}>
        <View style={styles.progressTop}>
          <View>
            <Text style={styles.progressTitle}>Tiến độ chặng</Text>
            <Text style={styles.progressSubtitle}>{completedLevels}/3 chặng đã ghi nhận</Text>
          </View>
          <Pill label={`${Object.values(lessonStars).reduce((sum, value) => sum + (value || 0), 0)}/9 sao`} color={colors.green} icon="star-outline" />
        </View>
        <ProgressBar value={completedLevels / 3} color={completedLevels >= 3 ? colors.green : colors.green} />
      </Card>

      <SectionTitle title="Ghi nhận học tập" />
      <View style={styles.levelStack}>
        {levels.map((level) => {
          const currentStars = lessonStars[level.key] || 0;
          const completed = currentStars > 0;
          return (
            <Card key={level.key} style={styles.levelCard} accent={level.color}>
              <View style={styles.levelCopy}>
                <Text style={styles.levelTitle}>{level.label}</Text>
                <Text style={styles.levelSubtitle}>
                  {completed ? `${currentStars} sao đã lưu` : `Hoàn thành để nhận ${level.xp} điểm kinh nghiệm`}
                </Text>
              </View>
              <PrimaryButton
                label={completed ? "Cập nhật" : "Hoàn thành"}
                icon={completed ? "checkmark-circle-outline" : "play-outline"}
                color={completed ? colors.ink : level.color}
                onPress={() => completeLevel(level)}
                disabled={savingLevel === level.key}
                style={styles.levelButton}
              />
            </Card>
          );
        })}
      </View>

      <SectionTitle title="Nội dung từ hệ thống" />
      <View style={styles.infoGrid}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoValue}>{lesson?.theoryModules?.length || 0}</Text>
          <Text style={styles.infoLabel}>mục lý thuyết</Text>
        </Card>
        <Card style={styles.infoCard}>
          <Text style={styles.infoValue}>{lesson?.quizzes?.length || 0}</Text>
          <Text style={styles.infoLabel}>câu hỏi</Text>
        </Card>
        <Card style={styles.infoCard}>
          <Text style={styles.infoValue}>{lesson?.challenges?.length || 0}</Text>
          <Text style={styles.infoLabel}>thử thách</Text>
        </Card>
      </View>

      {(lesson?.theoryModules || []).slice(0, 6).map((module, index) => (
        <Card key={`${normalizeModuleTitle(module, index)}-${index}`}>
          <Text style={styles.moduleTitle}>{normalizeModuleTitle(module, index)}</Text>
          {toDisplayText(module?.content || module?.text || module?.description) ? (
            <Text style={styles.moduleText} numberOfLines={4}>
              {toDisplayText(module.content || module.text || module.description)}
            </Text>
          ) : (
            <Text style={styles.moduleText}>Nội dung chi tiết đang được lưu trong dữ liệu bài học.</Text>
          )}
        </Card>
      ))}

      <GhostButton label="Quay lại lộ trình" icon="arrow-back-outline" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    gap: spacing.md
  },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  progressTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  progressSubtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3
  },
  levelStack: {
    gap: spacing.sm
  },
  levelCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  levelCopy: {
    flex: 1,
    gap: 4
  },
  levelTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  levelSubtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  levelButton: {
    minHeight: 44,
    width: 126
  },
  infoGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  infoCard: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: spacing.md
  },
  infoValue: {
    color: colors.green,
    fontSize: 24,
    fontWeight: "900"
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center"
  },
  moduleTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: spacing.sm
  },
  moduleText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600"
  }
});
