import React, { useMemo, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { CHEMISTRY_KNOWLEDGE_BASE, CORE_KNOWLEDGE_LESSONS } from '@aurum/shared/data';
import { useAuth } from '@/auth/AuthProvider';
import { AppScreen } from '@/components/AppScreen';
import { EntityList } from '@/components/EntityList';
import { Card, EmptyState, PrimaryButton, SectionTitle, Tag, TextField } from '@/components/Primitives';
import { api } from '@/lib/api';
import { useApiResource } from '@/lib/useApiResource';
import { colors, font, spacing } from '@/theme';

export const ClassroomScreen = () => {
  const { token } = useAuth();
  const { data, loading, error, reload } = useApiResource<Record<string, unknown>[]>('/classes', { auth: true });
  const [joinCode, setJoinCode] = useState('');

  const join = async () => {
    try {
      await api.post('/classes/join', { code: joinCode.trim() }, { token });
      setJoinCode('');
      reload();
    } catch (err) {
      Alert.alert('Không thể tham gia lớp', err instanceof Error ? err.message : 'Mã lớp không hợp lệ.');
    }
  };

  return (
    <AppScreen title="Lớp học" subtitle="Classroom, My Class, bài đăng, lịch học và thành viên.">
      <Card>
        <TextField label="Mã lớp" value={joinCode} onChangeText={setJoinCode} placeholder="Nhập mã lớp giáo viên gửi" />
        <PrimaryButton title="Tham gia lớp" onPress={join} disabled={!joinCode.trim()} />
      </Card>
      {loading ? <EmptyState title="Đang tải lớp học..." /> : null}
      {error ? <Tag tone="yellow">{error}</Tag> : null}
      <EntityList
        items={data || []}
        titleKeys={['name', 'title', 'code']}
        subtitleKeys={['description', 'grade', 'teacherName', 'code']}
        tagKey="grade"
        emptyTitle="Chưa có lớp học"
        onPress={(cls) => router.push(`/my-class?id=${encodeURIComponent(String(cls.id))}` as never)}
      />
    </AppScreen>
  );
};

export const MyClassScreen = () => {
  const { token } = useAuth();
  const params = useLocalSearchParams<{ id?: string }>();
  const classId = params.id;
  const { data: posts, reload: reloadPosts } = useApiResource<Record<string, unknown>[]>(classId ? `/classes/${classId}/posts` : null, { auth: true });
  const { data: schedules } = useApiResource<Record<string, unknown>[]>(classId ? `/classes/${classId}/schedules` : null, { auth: true });
  const { data: members } = useApiResource<Record<string, unknown>[]>(classId ? `/classes/${classId}/members` : null, { auth: true });
  const [content, setContent] = useState('');

  const createPost = async () => {
    if (!classId || !content.trim()) return;
    await api.post(`/classes/${classId}/posts`, { content: content.trim(), type: 'post' }, { token });
    setContent('');
    reloadPosts();
  };

  return (
    <AppScreen title="Lớp của tôi" subtitle={classId ? `Lớp ${classId}` : 'Chọn lớp từ màn hình Lớp học.'}>
      {!classId ? <EmptyState title="Chưa chọn lớp" body="Mở từ danh sách lớp để xem chi tiết." /> : null}
      <Card>
        <TextField label="Đăng bài" value={content} onChangeText={setContent} multiline placeholder="Thông báo hoặc thảo luận trong lớp..." />
        <PrimaryButton title="Đăng bài" onPress={createPost} disabled={!content.trim() || !classId} />
      </Card>
      <SectionTitle title="Bài đăng" />
      <EntityList items={posts || []} titleKeys={['title', 'content', 'id']} subtitleKeys={['content', 'created_at', 'type']} emptyTitle="Chưa có bài đăng" />
      <SectionTitle title="Lịch học" />
      <EntityList items={schedules || []} titleKeys={['title', 'name', 'id']} subtitleKeys={['description', 'start_time', 'date']} emptyTitle="Chưa có lịch học" />
      <SectionTitle title="Thành viên" />
      <EntityList items={members || []} titleKeys={['username', 'name', 'email']} subtitleKeys={['role', 'grade', 'email']} emptyTitle="Chưa có thành viên" />
    </AppScreen>
  );
};

export const ArenaScreen = () => {
  const { token } = useAuth();
  const { data: leaderboard } = useApiResource<Record<string, unknown>[]>('/arena/leaderboard');
  const { data: rooms, reload } = useApiResource<Record<string, unknown>[]>('/arena/rooms');
  const [difficulty, setDifficulty] = useState('easy');
  const { data: questions } = useApiResource<Record<string, unknown>[]>(`/arena/questions/${difficulty}`);

  const createRoom = async () => {
    try {
      await api.post('/arena/create', { difficulty, mode: '1v1' }, { token });
      reload();
    } catch (err) {
      Alert.alert('Không thể tạo phòng', err instanceof Error ? err.message : 'Vui lòng thử lại.');
    }
  };

  return (
    <AppScreen title="Đấu trường" subtitle="Room, câu hỏi, leaderboard và battle flow native.">
      <Card>
        <View style={styles.row}>
          {['easy', 'medium', 'hard'].map((item) => (
            <Text key={item} onPress={() => setDifficulty(item)} style={[styles.choice, difficulty === item && styles.choiceActive]}>{item}</Text>
          ))}
        </View>
        <PrimaryButton title="Tạo phòng đấu" onPress={createRoom} />
      </Card>
      <SectionTitle title="Phòng đang mở" />
      <EntityList items={rooms || []} titleKeys={['code', 'id', 'mode']} subtitleKeys={['difficulty', 'status', 'current_players']} emptyTitle="Chưa có phòng" />
      <SectionTitle title="Câu hỏi mẫu" />
      <EntityList items={(questions || []).slice(0, 5)} titleKeys={['question', 'prompt', 'id']} subtitleKeys={['answer', 'difficulty']} emptyTitle="Chưa có câu hỏi" />
      <SectionTitle title="Bảng xếp hạng" />
      <EntityList items={leaderboard || []} titleKeys={['username', 'name', 'id']} subtitleKeys={['xp', 'wins', 'score']} emptyTitle="Chưa có bảng xếp hạng" />
    </AppScreen>
  );
};

export const LibraryScreen = () => {
  const { data, loading, error } = useApiResource<Record<string, unknown>[]>('/materials');
  return (
    <AppScreen title="Thư viện" subtitle="Tài liệu học tập, tải xuống, xem chi tiết và phản hồi.">
      {loading ? <EmptyState title="Đang tải thư viện..." /> : null}
      {error ? <Tag tone="yellow">{error}</Tag> : null}
      <EntityList
        items={data || []}
        titleKeys={['title', 'name', 'id']}
        subtitleKeys={['description', 'category', 'type']}
        tagKey="type"
        emptyTitle="Chưa có tài liệu"
        onPress={(item) => router.push(`/material-detail?id=${encodeURIComponent(String(item.id))}` as never)}
      />
    </AppScreen>
  );
};

export const MaterialDetailScreen = () => {
  const { token } = useAuth();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;
  const { data: material } = useApiResource<Record<string, unknown>>(id ? `/materials/${id}` : null);
  const { data: feedback, reload } = useApiResource<Record<string, unknown>[]>(id ? `/materials/${id}/feedback` : null);
  const [message, setMessage] = useState('');

  const submit = async () => {
    if (!id || !message.trim()) return;
    await api.post(`/materials/${id}/feedback`, { content: message.trim(), rating: 5 }, { token });
    setMessage('');
    reload();
  };

  const open = async () => {
    const url = String(material?.url || material?.downloadUrl || material?.file_url || '');
    if (!url) return Alert.alert('Không có liên kết', 'Tài liệu này chưa có URL tải xuống.');
    Linking.openURL(url);
  };

  return (
    <AppScreen title={String(material?.title || material?.name || 'Chi tiết tài liệu')} subtitle={`ID ${id || ''}`}>
      <Card>
        <Tag tone="blue">{String(material?.type || material?.category || 'material')}</Tag>
        <Text style={styles.title}>{String(material?.title || material?.name || 'Tài liệu')}</Text>
        <Text style={styles.body}>{String(material?.description || 'Tài liệu học tập được đồng bộ từ web.')}</Text>
        <PrimaryButton title="Mở/tải tài liệu" onPress={open} />
      </Card>
      <SectionTitle title="Phản hồi" />
      <TextField label="Nội dung phản hồi" value={message} onChangeText={setMessage} multiline placeholder="Nhận xét về tài liệu..." />
      <PrimaryButton title="Gửi phản hồi" onPress={submit} disabled={!message.trim()} />
      <EntityList items={feedback || []} titleKeys={['username', 'author', 'id']} subtitleKeys={['content', 'message', 'reply']} emptyTitle="Chưa có phản hồi" />
    </AppScreen>
  );
};

export const LecturesScreen = () => {
  const [grade, setGrade] = useState('8');
  const { data } = useApiResource<Record<string, unknown>[]>(`/lessons?classId=${grade}`);
  return (
    <AppScreen title="Bài giảng" subtitle="Lecture list native, dùng lessons API giống web.">
      <View style={styles.row}>{['8', '9', '10', '11', '12'].map((item) => <Text key={item} onPress={() => setGrade(item)} style={[styles.choice, grade === item && styles.choiceActive]}>Lớp {item}</Text>)}</View>
      <EntityList items={data || []} titleKeys={['title', 'name', 'lessonId']} subtitleKeys={['description', 'summary']} tagKey="grade" emptyTitle="Chưa có bài giảng" />
    </AppScreen>
  );
};

export const KnowledgeMapScreen = () => {
  const items = useMemo(() => [
    ...Object.entries(CORE_KNOWLEDGE_LESSONS as Record<string, unknown>).map(([id, value]) => ({ id, ...(typeof value === 'object' && value ? value : { title: id }) })),
    ...(CHEMISTRY_KNOWLEDGE_BASE as Record<string, unknown>[]).slice(0, 30),
  ], []);
  return (
    <AppScreen title="Bản đồ kiến thức" subtitle="Core knowledge và theory data dùng chung với web.">
      <EntityList items={items} titleKeys={['title', 'name', 'id']} subtitleKeys={['explanation', 'description', 'category']} tagKey="category" emptyTitle="Chưa có kiến thức" />
    </AppScreen>
  );
};

export const ProfileScreen = () => {
  const { user, recoverStreak, resetStreak } = useAuth();
  return (
    <AppScreen title="Hồ sơ" subtitle="XP, streak, hoạt động và quick actions.">
      <Card>
        <Tag tone={user?.role === 'student' ? 'green' : 'blue'}>{user?.role || 'student'}</Tag>
        <Text style={styles.title}>{user?.username || user?.email || 'AURUM user'}</Text>
        <Text style={styles.body}>XP {user?.xp || 0} • Streak {user?.streakCount || 0} • Online hôm nay {user?.todayOnlineMinutes || 0} phút</Text>
      </Card>
      <View style={styles.row}>
        <PrimaryButton title="Khôi phục streak" onPress={() => recoverStreak(Number(user?.streakCount || 0) + 1)} tone="blue" />
        <PrimaryButton title="Reset streak" onPress={resetStreak} tone="ghost" />
      </View>
    </AppScreen>
  );
};

export const SettingsScreen = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(String(user?.username || ''));
  const save = async () => {
    const result = await updateUser({ username: displayName });
    Alert.alert(result.success ? 'Đã lưu' : 'Không thể lưu', result.message || 'Hồ sơ đã được cập nhật.');
  };
  return (
    <AppScreen title="Cài đặt" subtitle="Hồ sơ, nhắc học, mục tiêu và liên kết tài khoản.">
      <Card>
        <TextField label="Tên hiển thị" value={displayName} onChangeText={setDisplayName} />
        <PrimaryButton title="Lưu hồ sơ" onPress={save} />
        <PrimaryButton title="Làm mới dữ liệu" onPress={refreshUser} tone="ghost" />
      </Card>
    </AppScreen>
  );
};

export const StaticInfoScreen = ({ type }: { type: 'about' | 'contact' | 'terms' }) => {
  const copy = {
    about: ['Giới thiệu', 'AURUM là nền tảng học hóa học tương tác cho học sinh, giáo viên và quản trị viên.'],
    contact: ['Liên hệ', 'Kênh hỗ trợ, phản hồi và thông tin trường học được hiển thị giống web Contact.'],
    terms: ['Điều khoản', 'Điều khoản sử dụng, quyền riêng tư và quy định học tập của hệ thống.'],
  }[type];
  return (
    <AppScreen title={copy[0]} subtitle="Trang tĩnh được chuyển sang native.">
      <Card><Text style={styles.body}>{copy[1]}</Text></Card>
    </AppScreen>
  );
};

export const StageScreen = ({ stage }: { stage: 'intro' | 'story' | 'challenge' | 'quiz' | 'reward' }) => {
  const params = useLocalSearchParams<{ grade?: string; lessonId?: string }>();
  const titleMap = {
    intro: 'Mở màn hành trình',
    story: 'Câu chuyện',
    challenge: 'Thử thách',
    quiz: 'Quiz',
    reward: 'Phần thưởng',
  };
  return (
    <AppScreen title={titleMap[stage]} subtitle={`Lớp ${params.grade || ''} • Bài ${params.lessonId || ''}`}>
      <Card>
        <Tag tone="blue">{stage}</Tag>
        <Text style={styles.title}>{titleMap[stage]}</Text>
        <Text style={styles.body}>Flow stage web được chuyển thành màn hình native. Nội dung chi tiết lấy qua bài học và API progress.</Text>
      </Card>
    </AppScreen>
  );
};

export const AssignmentSubmitScreen = () => {
  const { token } = useAuth();
  const params = useLocalSearchParams<{ postId?: string }>();
  const [fileName, setFileName] = useState('');
  const submit = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (result.canceled || !params.postId) return;
    setFileName(result.assets[0].name);
    const form = new FormData();
    form.append('file', {
      uri: result.assets[0].uri,
      name: result.assets[0].name,
      type: result.assets[0].mimeType || 'application/octet-stream',
    } as unknown as Blob);
    await api.post(`/classes/assignments/${params.postId}/submit`, form, { token });
    Alert.alert('Đã nộp bài', result.assets[0].name);
  };
  return (
    <AppScreen title="Nộp bài" subtitle={`Bài giao ${params.postId || ''}`}>
      <Card>
        <Text style={styles.body}>{fileName || 'Chọn tệp để nộp bài tập.'}</Text>
        <PrimaryButton title="Chọn và nộp tệp" onPress={submit} />
      </Card>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  choice: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.muted,
    fontWeight: font.heavy,
  },
  choiceActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
    color: '#fff',
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: font.heavy,
  },
  body: {
    color: colors.muted,
    lineHeight: 21,
    fontWeight: font.medium,
  },
});
