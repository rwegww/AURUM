import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState, GhostButton, LoadingState, PrimaryButton, ProgressBar, Screen } from '../ui/Primitives';
import { useAuth } from '../../context/AuthContext';
import { useApiResource } from '../../hooks/useApiResource';
import { learningApi } from '../../services/api';
import { typography } from '../../constants/theme';
import { buildKnowledgeMapTree } from '../../../../shared/knowledgeMapData';
import { JOURNEY_THEMES } from '../../../../shared/journeyPresentation';
import JourneyNotebookModal from './JourneyNotebookModal';

const GRADES = [6, 7, 8, 9, 10, 11, 12];
const COLORS = ['#0ea5e9', '#06b6d4', '#16a34a', '#f97316', '#3b82f6', '#8b5cf6', '#ec4899'];
const Connector = () => <View style={styles.connector} />;

export default function KnowledgeMap() {
  const { user, isLoggedIn, loading } = useAuth();
  const [expandedGrade, setExpandedGrade] = React.useState(null);
  const [expandedLesson, setExpandedLesson] = React.useState(null);
  const [bookLesson, setBookLesson] = React.useState(null);
  const [bookLoading, setBookLoading] = React.useState(false);
  const [bookError, setBookError] = React.useState('');
  const request = React.useRef(0);
  React.useEffect(() => () => { request.current += 1; }, []);
  const resource = useApiResource(() => learningApi.bai_hoc({ view: 'knowledge' }), []);
  const tree = React.useMemo(() => buildKnowledgeMapTree(resource.data || []), [resource.data]);
  const unlocked = user?.unlockedLessons?.map(String) || [];
  const canReviewAll = ['admin', 'teacher'].includes(user?.role);
  const isDone = (lesson) => canReviewAll || unlocked.includes(String(lesson.lessonId));
  const allLessons = Object.values(tree).flat();
  const total = allLessons.reduce((count, lesson) => count + lesson.topics.length, 0);
  const completed = allLessons.filter(isDone).reduce((count, lesson) => count + lesson.topics.length, 0);
  const openBook = async (lesson) => {
    if (bookLoading) return;
    const current = ++request.current;
    setBookLoading(true); setBookError('');
    try {
      const full = await learningApi.lesson(lesson.lessonId);
      if (current === request.current) setBookLesson({ ...lesson, ...full });
    } catch (error) {
      if (current === request.current) setBookError(error.message || 'Chưa tải được tranh kiến thức.');
    } finally {
      if (current === request.current) setBookLoading(false);
    }
  };
  if (loading) return <LoadingState />;
  if (!isLoggedIn) return <Redirect href="/login" />;
  if (user?.role === 'student' && user?.balancingProgress?.placement?.required && user.balancingProgress.placement.status !== 'placed') return <Redirect href="/journey" />;
  return <Screen style={styles.page}>
    <GhostButton label="Quay lại lớp học" icon="arrow-back" onPress={() => router.replace('/journey')} />
    <Text style={styles.title}>SƠ ĐỒ TƯ DUY <Text style={styles.green}>HÓA HỌC</Text></Text>
    <View style={styles.progress}><View style={{ flex: 1 }}><ProgressBar value={total ? completed / total : 0} /></View><Text style={styles.meta}>{completed}/{total} chủ đề</Text></View>
    {resource.loading ? <LoadingState label="Đang đồng bộ nội dung từ Hành trình..." /> : resource.error ? <ErrorState message={resource.error.message} onRetry={resource.reload} /> : <>
      <Text style={styles.hint}>Vuốt ngang để xem các nhánh. Chạm vào khối và bài học để mở kiến thức.</Text>
      <ScrollView horizontal nestedScrollEnabled style={styles.canvas} contentContainerStyle={styles.tree}>
        <View style={styles.root}><Text style={styles.rootLabel}>HÓA HỌC</Text></View><Connector />
        <View style={styles.grades}>{GRADES.map((grade, gradeIndex) => {
          const lessons = tree[grade] || [];
          const color = COLORS[gradeIndex];
          const done = lessons.filter(isDone).length;
          const expanded = expandedGrade === grade;
          return <View key={grade} style={styles.branch}>
            <Connector />
            <Pressable accessibilityRole="button" accessibilityLabel={`Lớp ${grade}, ${done}/${lessons.length} bài`} accessibilityState={{ expanded }} style={[styles.grade, expanded && { borderColor: color }]} onPress={() => { setExpandedGrade(expanded ? null : grade); setExpandedLesson(null); }}>
              <View style={[styles.gradeBadge, { backgroundColor: color }]}><Text style={styles.gradeNumber}>{grade}</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.nodeTitle}>Lớp {grade}</Text><Text style={styles.meta}>{done}/{lessons.length} bài</Text></View><Ionicons name={expanded ? 'chevron-down' : 'chevron-forward'} size={18} color={color} />
            </Pressable>
            {expanded ? <><Connector /><View style={styles.lessons}>{lessons.length ? lessons.map((lesson) => {
              const lessonDone = isDone(lesson);
              const lessonOpen = expandedLesson === lesson.lessonId;
              return <View key={lesson.lessonId} style={styles.branch}><Connector />
                <Pressable accessibilityRole="button" accessibilityLabel={lesson.title} accessibilityState={{ expanded: lessonOpen }} onPress={() => setExpandedLesson(lessonOpen ? null : lesson.lessonId)} style={[styles.lesson, !lessonDone && styles.locked, lessonOpen && { borderColor: color }]}>
                  <Ionicons name={lessonDone ? 'checkmark-circle' : 'lock-closed'} size={24} color={lessonDone ? color : '#94a3b8'} />
                  <View style={{ flex: 1 }}><Text style={styles.lessonTitle}>{String(lesson.title || '').replace(/^Bài\s+\d+\s*[.:]\s*/i, '')}</Text><Text style={styles.meta}>{lesson.topics.length} kiến thức cốt lõi</Text></View><Ionicons name={lessonOpen ? 'chevron-down' : 'chevron-forward'} size={16} color={color} />
                </Pressable>
                {lessonOpen ? <><Connector /><View style={styles.topics}>{lesson.topics.map((topic) => <View key={topic.id} style={styles.branch}><Connector /><View style={[styles.topic, !lessonDone && styles.locked]}>
                  <View style={[styles.dot, { backgroundColor: lessonDone ? color : '#cbd5e1' }]} /><View style={{ flex: 1 }}><Text style={styles.lessonTitle}>{topic.title}</Text>{topic.description ? <Text style={styles.description}>{topic.description}</Text> : null}</View>{lessonDone ? <Ionicons name="checkmark-circle" size={16} color="#58cc02" /> : null}
                </View></View>)}
                  {lessonDone ? <View style={styles.actions}>
                    <GhostButton label="Xem lại bài học" onPress={() => router.push({ pathname: '/lectures/[grade]/[lessonId]', params: { grade: String(grade), lessonId: lesson.lessonId } })} />
                    <PrimaryButton label={bookLoading ? 'Đang tải...' : 'Infographic'} icon="image-outline" disabled={bookLoading} onPress={() => openBook(lesson)} />
                  </View> : null}
                </View></> : null}
              </View>;
            }) : <Text style={styles.meta}>Nội dung đang được cập nhật.</Text>}</View></> : null}
          </View>;
        })}</View>
      </ScrollView>
    </>}
    {bookError ? <Text accessibilityRole="alert" style={styles.error}>{bookError}</Text> : null}
    {bookLesson ? <JourneyNotebookModal visible onClose={() => setBookLesson(null)} lessons={[bookLesson]} grade={String(bookLesson.classId)} user={user} theme={JOURNEY_THEMES[bookLesson.classId] || JOURNEY_THEMES['8']} /> : null}
  </Screen>;
}

const styles = StyleSheet.create({
  page: { backgroundColor: '#fafaf8', gap: 20, paddingHorizontal: 16 }, title: { fontFamily: typography.black, fontSize: 30, lineHeight: 38, color: '#1a1a1a' }, green: { color: '#58cc02' },
  progress: { flexDirection: 'row', gap: 16, alignItems: 'center', maxWidth: 340 }, meta: { fontFamily: typography.bold, fontSize: 11, color: '#94a3b8', marginTop: 4 }, hint: { fontFamily: typography.medium, fontSize: 13, color: '#64748b', lineHeight: 20 },
  canvas: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#f1f5f9', borderRadius: 24 }, tree: { padding: 32, flexDirection: 'row', alignItems: 'center', minHeight: 600 },
  root: { backgroundColor: '#58cc02', borderBottomWidth: 6, borderColor: '#047857', borderRadius: 32, paddingHorizontal: 32, paddingVertical: 20 }, rootLabel: { fontFamily: typography.black, fontSize: 20, color: '#ffffff', letterSpacing: 2 },
  connector: { width: 40, height: 3, backgroundColor: '#e2e8f0' }, branch: { flexDirection: 'row', alignItems: 'center' }, grades: { gap: 24, borderLeftWidth: 3, borderColor: '#e2e8f0' }, lessons: { gap: 16, paddingVertical: 8, borderLeftWidth: 3, borderColor: '#e2e8f0' }, topics: { gap: 12, borderLeftWidth: 3, borderColor: '#e2e8f0' },
  grade: { width: 240, borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', gap: 16, alignItems: 'center' }, gradeBadge: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, gradeNumber: { color: '#ffffff', fontFamily: typography.black, fontSize: 18 }, nodeTitle: { fontFamily: typography.black, fontSize: 15, color: '#1a1a1a' },
  lesson: { width: 280, padding: 16, borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 12, gap: 12, flexDirection: 'row', alignItems: 'center' }, lessonTitle: { fontFamily: typography.bold, fontSize: 13, lineHeight: 19, color: '#334155' }, locked: { backgroundColor: '#f8fafc', opacity: 0.65 },
  topic: { width: 300, borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 12, padding: 16, gap: 12, flexDirection: 'row', alignItems: 'center' }, dot: { height: 10, width: 10, borderRadius: 5 }, description: { fontFamily: typography.regular, fontSize: 11, color: '#94a3b8', lineHeight: 17, marginTop: 4 },
  actions: { marginLeft: 40, width: 300, gap: 8 }, error: { color: '#b42318', fontFamily: typography.bold, fontSize: 14 },
});
