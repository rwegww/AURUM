import React from "react";
import { StyleSheet, Text } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import {
  Card,
  ErrorState,
  GhostButton,
  LoadingState,
  Screen
} from "../../../../components/ui/Primitives";
import LessonPlayer from "../../../../components/journey/LessonPlayer";
import { colors, spacing, typography } from "../../../../constants/theme";
import { useAuth } from "../../../../context/AuthContext";
import { learningApi } from "../../../../services/api";
import { useApiResource } from "../../../../hooks/useApiResource";

import { getJourneyLessonStatuses, lessonIdOf } from "../../../../../../shared/journeyProgress";

export default function LessonDetailScreen() {
  const { lessonId, grade } = useLocalSearchParams();
  const { token, user, refreshProfile, isLoggedIn, loading: authLoading } = useAuth();
  const lessonKey = Array.isArray(lessonId) ? lessonId[0] : lessonId;
  const gradeKey = Array.isArray(grade) ? grade[0] : grade;
  const lessonResource = useApiResource(async () => {
    const [lesson, lessons] = await Promise.all([
      learningApi.lesson(lessonKey),
      learningApi.bai_hoc({ classId: Number(gradeKey), view: "journey" })
    ]);
    return { lesson, lessons, lessonKey, gradeKey };
  }, [gradeKey, lessonKey]);
  const lesson = lessonResource.data?.lessonKey === lessonKey && lessonResource.data?.gradeKey === gradeKey ? lessonResource.data.lesson : null;
  const gradeLessons = lessonResource.data?.lessons || [];
  const lessonStars = user?.balancingProgress?.lessonStars?.[lessonKey] || {};
  const lessonIndex = gradeLessons.findIndex((item) => String(lessonIdOf(item)) === String(lessonKey));
  const placement = user?.balancingProgress?.placement;
  const placementAllowed = user?.role !== 'student' || !placement?.required
    || (placement.status === 'placed' && String(placement.assignedGrade) === String(gradeKey));
  const isUnlocked = placementAllowed && getJourneyLessonStatuses(gradeLessons, user, gradeKey)[lessonIndex]?.isUnlocked;
  const onReturn = () => router.replace({ pathname: '/journey/[grade]', params: { grade: gradeKey } });
  const saveLevel = async (level) => {
    if (!token) throw new Error('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại để lưu tiến độ.');
    const result = await learningApi.completeLessonSegment(token, { lessonId: lessonKey, level, stars: 1 });
    if (result?.success === false) throw new Error(result.message || 'Không thể lưu mốc sao.');
    await refreshProfile();
  };

  if (authLoading) return <LoadingState />;
  if (!isLoggedIn) return <Redirect href="/login" />;
  if (lessonResource.loading && !lesson) return <LoadingState label="Đang chuẩn bị bài học..." />;
  if (lessonResource.error || !lesson) {
    return (
      <Screen>
        <ErrorState message={lessonResource.error?.message || "Không tìm thấy bài học."} onRetry={lessonResource.reload} />
        <GhostButton label="Quay lại lộ trình" icon="arrow-back-outline" onPress={onReturn} />
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
        <GhostButton label="Quay lại lộ trình" icon="arrow-back-outline" onPress={onReturn} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.page}>
      <LessonPlayer key={lessonKey} lesson={lesson} lessonStars={lessonStars} onCompleteLevel={saveLevel} onReturn={onReturn} grade={gradeKey} order={lessonIndex + 1} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { paddingTop: spacing.sm, maxWidth: 720, width: '100%', alignSelf: 'center' },
  lockedCard: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  lockedIcon: { fontSize: 44 },
  lockedTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 21, textAlign: 'center' },
  lockedText: { color: colors.muted, fontFamily: typography.medium, fontSize: 14, lineHeight: 21, textAlign: 'center' }
});
