import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/auth/AuthProvider';
import { AppScreen } from '@/components/AppScreen';
import { EntityList } from '@/components/EntityList';
import { Card, EmptyState, PrimaryButton, SectionTitle, TextField } from '@/components/Primitives';
import { api } from '@/lib/api';
import { useApiResource } from '@/lib/useApiResource';
import { colors, font, spacing } from '@/theme';

export const TeacherDashboardScreen = () => {
  const { user } = useAuth();
  const { data: classes } = useApiResource<Record<string, unknown>[]>('/classes', { auth: true });
  const { data: summary } = useApiResource<Record<string, unknown>>('/classes/teacher-summary', { auth: true });
  const { data: notifications } = useApiResource<Record<string, unknown>[]>('/classes/teacher/notifications', { auth: true });

  return (
    <AppScreen title="Bảng giáo viên" subtitle={`Xin chào ${user?.username || 'giáo viên'}`}>
      <View style={styles.statRow}>
        <Card><Text style={styles.stat}>{classes?.length || 0}</Text><Text style={styles.label}>lớp</Text></Card>
        <Card><Text style={styles.stat}>{Number(summary?.assignments || summary?.assignmentCount || 0)}</Text><Text style={styles.label}>bài giao</Text></Card>
      </View>
      <SectionTitle title="Thông báo" />
      <EntityList items={notifications || []} titleKeys={['title', 'type', 'id']} subtitleKeys={['message', 'description', 'created_at']} emptyTitle="Chưa có thông báo" />
      <SectionTitle title="Lớp gần đây" />
      <EntityList items={(classes || []).slice(0, 5)} titleKeys={['name', 'title', 'code']} subtitleKeys={['grade', 'description', 'code']} onPress={(cls) => router.push(`/teacher/class-detail?id=${cls.id}` as never)} />
    </AppScreen>
  );
};

export const TeacherClassManagerScreen = () => {
  const { token } = useAuth();
  const { data, loading, reload } = useApiResource<Record<string, unknown>[]>('/classes', { auth: true });
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('10');

  const create = async () => {
    try {
      await api.post('/classes', { name, grade }, { token });
      setName('');
      reload();
    } catch (err) {
      Alert.alert('Không thể tạo lớp', err instanceof Error ? err.message : 'Vui lòng thử lại.');
    }
  };

  return (
    <AppScreen title="Quản lý lớp" subtitle="Tạo lớp, xem thành viên, bài đăng và lịch học.">
      <Card>
        <TextField label="Tên lớp" value={name} onChangeText={setName} placeholder="Hóa 10A1" />
        <TextField label="Khối" value={grade} onChangeText={setGrade} keyboardType="number-pad" placeholder="10" />
        <PrimaryButton title="Tạo lớp" onPress={create} disabled={!name.trim()} />
      </Card>
      {loading ? <EmptyState title="Đang tải lớp..." /> : null}
      <EntityList items={data || []} titleKeys={['name', 'title', 'code']} subtitleKeys={['grade', 'description', 'code']} tagKey="grade" onPress={(cls) => router.push(`/teacher/class-detail?id=${cls.id}` as never)} />
    </AppScreen>
  );
};

export const TeacherClassDetailScreen = () => {
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: posts, reload: reloadPosts } = useApiResource<Record<string, unknown>[]>(id ? `/classes/${id}/posts` : null, { auth: true });
  const { data: schedules, reload: reloadSchedules } = useApiResource<Record<string, unknown>[]>(id ? `/classes/${id}/schedules` : null, { auth: true });
  const { data: members } = useApiResource<Record<string, unknown>[]>(id ? `/classes/${id}/members` : null, { auth: true });
  const [postContent, setPostContent] = useState('');
  const [scheduleTitle, setScheduleTitle] = useState('');

  const addPost = async () => {
    if (!id || !postContent.trim()) return;
    await api.post(`/classes/${id}/posts`, { content: postContent.trim(), type: 'post' }, { token });
    setPostContent('');
    reloadPosts();
  };

  const addSchedule = async () => {
    if (!id || !scheduleTitle.trim()) return;
    await api.post(`/classes/${id}/schedules`, { title: scheduleTitle.trim(), date: new Date().toISOString() }, { token });
    setScheduleTitle('');
    reloadSchedules();
  };

  return (
    <AppScreen title="Chi tiết lớp" subtitle={`ID ${id || ''}`}>
      <Card>
        <TextField label="Thông báo mới" value={postContent} onChangeText={setPostContent} multiline />
        <PrimaryButton title="Đăng thông báo" onPress={addPost} disabled={!postContent.trim()} />
      </Card>
      <Card>
        <TextField label="Lịch học mới" value={scheduleTitle} onChangeText={setScheduleTitle} />
        <PrimaryButton title="Thêm lịch" onPress={addSchedule} disabled={!scheduleTitle.trim()} tone="blue" />
      </Card>
      <SectionTitle title="Bài đăng" />
      <EntityList items={posts || []} titleKeys={['title', 'content', 'id']} subtitleKeys={['content', 'created_at', 'type']} emptyTitle="Chưa có bài đăng" />
      <SectionTitle title="Lịch học" />
      <EntityList items={schedules || []} titleKeys={['title', 'name', 'id']} subtitleKeys={['date', 'start_time', 'description']} emptyTitle="Chưa có lịch học" />
      <SectionTitle title="Thành viên" />
      <EntityList items={members || []} titleKeys={['username', 'name', 'email']} subtitleKeys={['role', 'grade', 'email']} emptyTitle="Chưa có thành viên" />
    </AppScreen>
  );
};

export const TeacherAssignmentsScreen = () => {
  const { token } = useAuth();
  const { data: assignments, reload } = useApiResource<Record<string, unknown>[]>('/classes/assignments/all', { auth: true });
  const { data: classes } = useApiResource<Record<string, unknown>[]>('/classes', { auth: true });
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('');
  const [content, setContent] = useState('');
  const [parsedName, setParsedName] = useState('');

  const parseExam = async () => {
    const picked = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (picked.canceled) return;
    const form = new FormData();
    form.append('file', {
      uri: picked.assets[0].uri,
      name: picked.assets[0].name,
      type: picked.assets[0].mimeType || 'application/octet-stream',
    } as unknown as Blob);
    await api.post('/classes/parse-exam-file', form, { token });
    setParsedName(picked.assets[0].name);
  };

  const create = async () => {
    if (!classId.trim() || !title.trim()) return;
    await api.post(`/classes/${classId}/posts`, { title, content, type: 'assignment' }, { token });
    setTitle('');
    setContent('');
    reload();
  };

  return (
    <AppScreen title="Bài giao" subtitle="Tạo bài, phân tích đề, xem nộp bài và chấm điểm.">
      <Card>
        <TextField label="ID lớp" value={classId} onChangeText={setClassId} placeholder={String(classes?.[0]?.id || '')} />
        <TextField label="Tiêu đề" value={title} onChangeText={setTitle} />
        <TextField label="Nội dung" value={content} onChangeText={setContent} multiline />
        <PrimaryButton title="Tạo bài giao" onPress={create} disabled={!classId.trim() || !title.trim()} />
        <PrimaryButton title={parsedName ? `Đã phân tích ${parsedName}` : 'Phân tích đề từ tệp'} onPress={parseExam} tone="ghost" />
      </Card>
      <EntityList
        items={assignments || []}
        titleKeys={['title', 'name', 'id']}
        subtitleKeys={['content', 'class_name', 'created_at']}
        tagKey="type"
        emptyTitle="Chưa có bài giao"
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    color: colors.green,
    fontSize: 30,
    fontWeight: font.heavy,
  },
  label: {
    color: colors.muted,
    fontWeight: font.bold,
  },
});
