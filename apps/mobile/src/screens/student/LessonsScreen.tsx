import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { flattenCurriculum, gradeOptions } from '@aurum/shared/data';
import type { LessonSummary } from '@aurum/shared/types';
import { AppScreen } from '@/components/AppScreen';
import { EntityList } from '@/components/EntityList';
import { EmptyState, SectionTitle, Tag } from '@/components/Primitives';
import { useApiResource } from '@/lib/useApiResource';
import { colors, font, radius, spacing } from '@/theme';

export const LessonsScreen = () => {
  const [grade, setGrade] = useState('8');
  const { data, loading, error } = useApiResource<LessonSummary[]>(`/lessons?classId=${grade}`);
  const localLessons = useMemo(() => flattenCurriculum(grade), [grade]);
  const lessons = data?.length ? data : localLessons;

  return (
    <AppScreen title="Bài học" subtitle="Danh sách bài học, giáo trình và chi tiết lý thuyết như web.">
      <View style={styles.gradeRow}>
        {gradeOptions.map((item) => (
          <Pressable key={item} onPress={() => setGrade(item)} style={[styles.grade, grade === item && styles.gradeActive]}>
            <Text style={[styles.gradeText, grade === item && styles.gradeTextActive]}>Lớp {item}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle title={`Chương trình lớp ${grade}`} subtitle={data?.length ? 'Dữ liệu tải từ API /lessons.' : 'Đang dùng curriculum local trong packages/shared khi API chưa có dữ liệu.'} />
      {loading ? <EmptyState title="Đang tải bài học..." /> : null}
      {error ? <Tag tone="yellow">{error}</Tag> : null}
      <EntityList
        items={lessons as Record<string, unknown>[]}
        titleKeys={['title', 'name', 'lessonName']}
        subtitleKeys={['description', 'summary', 'objective']}
        tagKey="lessonId"
        emptyTitle="Chưa có bài học"
        onPress={(lesson) => {
          const lessonId = String(lesson.lessonId || lesson.id || lesson.slug || '');
          router.push(`/lesson-detail?grade=${grade}&lessonId=${encodeURIComponent(lessonId)}` as never);
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  gradeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  grade: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  gradeActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  gradeText: {
    color: colors.muted,
    fontWeight: font.heavy,
  },
  gradeTextActive: {
    color: '#fff',
  },
});
