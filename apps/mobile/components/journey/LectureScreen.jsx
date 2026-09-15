import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useApiResource } from '../../hooks/useApiResource';
import { learningApi } from '../../services/api';
import { typography } from '../../constants/theme';
import { ErrorState, GhostButton, LoadingState, Screen } from '../ui/Primitives';
import { getLessonDisplayTitle, getAurumLessonOrder, formatSgkLessonReference } from '../../../../shared/lessonLabels';
import TheoryContent from './TheoryContent';
import LectureVideo from './LectureVideo';
import LessonDiscussion from './LessonDiscussion';

export default function LectureScreen() {
  const params = useLocalSearchParams();
  const grade = String(params.grade);
  const lessonId = String(params.lessonId);
  const { isLoggedIn, loading } = useAuth();
  const key = `${grade}/${lessonId}`;
  const resource = useApiResource(async () => {
    const [lesson, lessons] = await Promise.all([learningApi.lesson(lessonId), learningApi.bai_hoc({ classId: Number(grade) })]);
    if (!lesson?.title || !Array.isArray(lessons)) throw new Error('Chưa tải được bài giảng.');
    return { key, lesson, lessons };
  }, [key]);
  if (loading) return <LoadingState />;
  if (!isLoggedIn) return <Redirect href="/login" />;
  if (resource.error) return <Screen><GhostButton label="Về cây kiến thức" onPress={() => router.replace('/knowledge-map')} /><ErrorState message={resource.error.message} onRetry={resource.reload} /></Screen>;
  if (resource.loading || resource.data?.key !== key) return <LoadingState label="Đang tải bài giảng..." />;
  const { lesson, lessons } = resource.data;
  const index = lessons.findIndex((item) => String(item.lessonId ?? item.id) === lessonId);
  const order = getAurumLessonOrder(lesson, index);
  const title = getLessonDisplayTitle(lesson);
  const reference = formatSgkLessonReference(lesson);
  const video = lesson.videoModules?.find((item) => item?.url);
  return <Screen style={styles.page}>
    <GhostButton label="Về cây kiến thức" icon="arrow-back" onPress={() => router.replace('/knowledge-map')} />
    <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.lessonList}>
      {lessons.map((item, i) => <Pressable key={item.lessonId ?? item.id} accessibilityRole="button" accessibilityLabel={item.title} accessibilityState={{ selected: i === index }} style={[styles.lessonChip, i === index && styles.current]} onPress={() => router.replace({ pathname: '/lectures/[grade]/[lessonId]', params: { grade, lessonId: String(item.lessonId ?? item.id) } })}><Text style={[styles.chipText, i === index && { color: '#ffffff' }]}>{i + 1}. {getLessonDisplayTitle(item)}</Text></Pressable>)}
    </ScrollView>
    <View style={styles.badges}><Text style={styles.grade}>LỚP {grade}</Text>{order ? <Text style={styles.label}>BÀI {order} TRÊN AURUM</Text> : null}{reference ? <Text style={styles.reference}>{reference}</Text> : null}</View>
    <Text style={styles.title}>{title}</Text>
    {video ? <View style={styles.video}><Text style={styles.videoTitle}>{title} | Aurum TV</Text><LectureVideo url={video.url} title={title} /></View> : null}
    <View style={styles.content}><Text style={styles.contentTitle}>Nội dung bài học</Text><TheoryContent key={key} modules={lesson.theoryModules} /></View>
    <LessonDiscussion key={key} lessonId={lessonId} />
  </Screen>;
}

const styles = StyleSheet.create({
  page: { gap: 24, paddingHorizontal: 16, maxWidth: 1200, width: '100%', alignSelf: 'center' }, title: { fontFamily: typography.bold, color: '#1a1a1a', fontSize: 28, lineHeight: 36 },
  lessonList: { gap: 8, paddingBottom: 10 }, lessonChip: { borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#ffffff', borderRadius: 16, padding: 14, maxWidth: 230 }, current: { backgroundColor: '#76c034', borderColor: '#76c034' }, chipText: { color: '#475569', fontFamily: typography.bold, fontSize: 13 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, grade: { color: '#ffffff', backgroundColor: '#76c034', padding: 8, borderRadius: 8, fontFamily: typography.bold, fontSize: 11 }, label: { color: '#64748b', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', padding: 8, borderRadius: 8, fontFamily: typography.bold, fontSize: 11 }, reference: { color: '#b45309', backgroundColor: '#fffbeb', padding: 8, borderRadius: 8, fontFamily: typography.bold, fontSize: 11 },
  video: { borderRadius: 24, overflow: 'hidden', backgroundColor: '#ffffff' }, videoTitle: { fontFamily: typography.bold, fontSize: 14, padding: 18, color: '#1a1a1a' }, content: { backgroundColor: '#ffffff', borderRadius: 24, borderWidth: 1, borderColor: '#e5e7eb', padding: 20, gap: 24 }, contentTitle: { fontFamily: typography.bold, fontSize: 20, color: '#76c034', borderBottomWidth: 1, borderColor: '#e5e7eb', paddingBottom: 16 },
});
