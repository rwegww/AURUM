import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { flattenCurriculum } from '@aurum/shared/data';
import type { LessonSummary } from '@aurum/shared/types';
import { useAuth } from '@/auth/AuthProvider';
import { AppScreen } from '@/components/AppScreen';
import { Card, EmptyState, PrimaryButton, SectionTitle, Tag, TextField } from '@/components/Primitives';
import { EntityList } from '@/components/EntityList';
import { useApiResource } from '@/lib/useApiResource';
import { api } from '@/lib/api';
import { colors, font } from '@/theme';

const normalizeModules = (lesson: Record<string, unknown> | null) => {
  const candidates = [lesson?.modules, lesson?.theory, lesson?.content, lesson?.sections];
  for (const item of candidates) {
    if (Array.isArray(item)) return item;
    if (item && typeof item === 'object' && Array.isArray((item as { modules?: unknown[] }).modules)) {
      return (item as { modules: unknown[] }).modules;
    }
  }
  return [];
};

export const LessonDetailScreen = () => {
  const { grade = '8', lessonId = '' } = useLocalSearchParams<{ grade?: string; lessonId?: string }>();
  const { token, completeLessonSegment } = useAuth();
  const [discussionText, setDiscussionText] = useState('');
  const { data, loading, error } = useApiResource<LessonSummary>(lessonId ? `/lessons/${lessonId}` : null);
  const { data: discussions, reload } = useApiResource<Record<string, unknown>[]>(lessonId ? `/discussions/${lessonId}` : null);
  const localLesson = useMemo(() => (flattenCurriculum(grade) as Record<string, unknown>[]).find((item) => String(item.lessonId || item.id) === String(lessonId)), [grade, lessonId]);
  const lesson = (data || localLesson || null) as Record<string, unknown> | null;
  const modules = normalizeModules(lesson);

  const postDiscussion = async () => {
    if (!discussionText.trim()) return;
    await api.post('/discussions', { lessonId, content: discussionText.trim() }, { token });
    setDiscussionText('');
    reload();
  };

  const complete = async () => {
    const result = await completeLessonSegment(String(lessonId), 'lesson', 3);
    Alert.alert(result.success ? 'Đã lưu tiến độ' : 'Không thể lưu', result.message || 'Bạn đã hoàn thành phân đoạn bài học.');
  };

  return (
    <AppScreen title={String(lesson?.title || lesson?.name || 'Chi tiết bài học')} subtitle={`Lớp ${grade} • ${lessonId}`}>
      {loading ? <EmptyState title="Đang tải bài học..." /> : null}
      {error ? <Tag tone="yellow">{error}</Tag> : null}
      <Card>
        <Text style={styles.lessonTitle}>{String(lesson?.title || lesson?.name || 'Bài học')}</Text>
        <Text style={styles.lessonBody}>{String(lesson?.description || lesson?.summary || 'Nội dung bài học được đồng bộ từ web và API lessons.')}</Text>
        <PrimaryButton title="Đánh dấu hoàn thành" onPress={complete} />
      </Card>

      <SectionTitle title="Lý thuyết" subtitle="Renderer native hiển thị các module văn bản thay cho ReactMarkdown DOM." />
      {modules.length ? modules.map((module, index) => {
        const entry = module as { type?: string; content?: any };
        const content = entry.content || {};
        const text = typeof content === 'string' ? content : content.text || content.content || content.title || JSON.stringify(content);
        return (
          <Card key={index}>
            <Tag tone="blue">{entry.type || 'module'}</Tag>
            <Text style={styles.moduleText}>{String(text).replace(/\\n/g, '\n')}</Text>
          </Card>
        );
      }) : <EmptyState title="Chưa có module lý thuyết" body="Bài học này chưa có module nội dung trong API/local curriculum." />}

      <SectionTitle title="Thảo luận và ghi chú" subtitle="Dùng cùng endpoint /api/discussions với web." />
      <TextField label="Nội dung thảo luận" value={discussionText} onChangeText={setDiscussionText} multiline placeholder="Viết câu hỏi hoặc ghi chú..." />
      <PrimaryButton title="Gửi thảo luận" onPress={postDiscussion} disabled={!discussionText.trim()} />
      <EntityList
        items={discussions || []}
        titleKeys={['username', 'author', 'user_name', 'id']}
        subtitleKeys={['content', 'message', 'note']}
        emptyTitle="Chưa có thảo luận"
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  lessonTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: font.heavy,
  },
  lessonBody: {
    color: colors.muted,
    lineHeight: 21,
    fontWeight: font.medium,
  },
  moduleText: {
    color: colors.text,
    lineHeight: 22,
    fontSize: 15,
    fontWeight: font.medium,
  },
});
