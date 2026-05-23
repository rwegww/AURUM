import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useLocalSearchParams } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { EntityList } from '@/components/EntityList';
import { Card, EmptyState, PrimaryButton, Tag, TextField } from '@/components/Primitives';
import { api } from '@/lib/api';
import { useApiResource } from '@/lib/useApiResource';
import { useAuth } from '@/auth/AuthProvider';
import { colors, font, spacing } from '@/theme';

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: () => colors.green,
  labelColor: () => colors.muted,
  propsForBackgroundLines: { stroke: '#edf0e9' },
};

export const AdminDashboardScreen = () => {
  const { data, loading, error } = useApiResource<Record<string, any>>('/admin/stats', { auth: true });
  const users = Number(data?.users || data?.totalUsers || 0);
  const lessons = Number(data?.lessons || data?.totalLessons || 0);
  const feedback = Number(data?.feedback || data?.pendingFeedback || 0);

  return (
    <AppScreen title="Quản trị" subtitle="Dashboard native với chart thay thế Recharts web.">
      {loading ? <EmptyState title="Đang tải thống kê..." /> : null}
      {error ? <Tag tone="yellow">{error}</Tag> : null}
      <View style={styles.statRow}>
        <Card><Text style={styles.stat}>{users}</Text><Text style={styles.label}>người dùng</Text></Card>
        <Card><Text style={styles.stat}>{lessons}</Text><Text style={styles.label}>bài học</Text></Card>
        <Card><Text style={styles.stat}>{feedback}</Text><Text style={styles.label}>phản hồi</Text></Card>
      </View>
      <Card>
        <Text style={styles.title}>Tổng quan hệ thống</Text>
        <BarChart
          width={320}
          height={220}
          data={{ labels: ['User', 'Lesson', 'Feedback'], datasets: [{ data: [users, lessons, feedback] }] }}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
        />
      </Card>
      <Card>
        <Text style={styles.title}>Tỷ trọng</Text>
        <PieChart
          width={320}
          height={190}
          data={[
            { name: 'User', population: users || 1, color: colors.green, legendFontColor: colors.muted, legendFontSize: 12 },
            { name: 'Lesson', population: lessons || 1, color: colors.blue, legendFontColor: colors.muted, legendFontSize: 12 },
            { name: 'Feedback', population: feedback || 1, color: colors.yellow, legendFontColor: colors.muted, legendFontSize: 12 },
          ]}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="12"
          chartConfig={chartConfig}
        />
      </Card>
    </AppScreen>
  );
};

export const AdminUsersScreen = () => {
  const { token } = useAuth();
  const { data, loading, reload } = useApiResource<Record<string, unknown>[]>('/admin/users', { auth: true });
  const [query, setQuery] = useState('');
  const users = (data || []).filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase()));

  const lock = async (id: string) => {
    await api.patch(`/admin/users/${id}/lock`, {}, { token });
    reload();
  };

  return (
    <AppScreen title="Người dùng" subtitle="Danh sách, tìm kiếm, khóa/mở và xem chi tiết.">
      <TextField label="Tìm kiếm" value={query} onChangeText={setQuery} placeholder="Email, username, role..." />
      {loading ? <EmptyState title="Đang tải người dùng..." /> : null}
      <EntityList
        items={users}
        titleKeys={['username', 'email', 'id']}
        subtitleKeys={['email', 'role', 'grade']}
        tagKey="role"
        emptyTitle="Chưa có người dùng"
        onPress={(item) => Alert.alert('Quản lý người dùng', String(item.email || item.username || item.id), [
          { text: 'Đóng' },
          { text: 'Khóa/Mở', onPress: () => lock(String(item.id)) },
        ])}
      />
    </AppScreen>
  );
};

export const AdminUserDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data } = useApiResource<Record<string, unknown>>(id ? `/admin/users/${id}` : null, { auth: true });
  return (
    <AppScreen title="Chi tiết người dùng" subtitle={`ID ${id || ''}`}>
      <Card>
        <Text style={styles.title}>{String(data?.username || data?.email || 'Người dùng')}</Text>
        <Text style={styles.body}>{JSON.stringify(data || {}, null, 2)}</Text>
      </Card>
    </AppScreen>
  );
};

export const AdminLessonsScreen = () => {
  const { token } = useAuth();
  const { data, reload } = useApiResource<Record<string, unknown>[]>('/lessons');
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('10');

  const create = async () => {
    try {
      await api.post('/admin/lessons', { title, classId: grade, description: 'Tạo từ app mobile' }, { token });
      setTitle('');
      reload();
    } catch (err) {
      Alert.alert('Không thể tạo bài học', err instanceof Error ? err.message : 'Vui lòng thử lại.');
    }
  };

  return (
    <AppScreen title="Quản lý bài học" subtitle="Tạo, xem và chuẩn bị chỉnh sửa bài học từ mobile.">
      <Card>
        <TextField label="Tiêu đề" value={title} onChangeText={setTitle} />
        <TextField label="Khối" value={grade} onChangeText={setGrade} />
        <PrimaryButton title="Tạo bài học" onPress={create} disabled={!title.trim()} />
      </Card>
      <EntityList items={data || []} titleKeys={['title', 'name', 'lessonId']} subtitleKeys={['description', 'grade', 'classId']} tagKey="classId" emptyTitle="Chưa có bài học" />
    </AppScreen>
  );
};

export const AdminJourneyScreen = () => {
  const [grade, setGrade] = useState('10');
  const { data } = useApiResource<Record<string, unknown>[]>(`/lessons?classId=${grade}`);
  return (
    <AppScreen title="Lộ trình" subtitle="Journey manager native: sắp xếp và kiểm tra các stage bài học.">
      <View style={styles.choiceRow}>{['8', '9', '10', '11', '12'].map((item) => <Text key={item} onPress={() => setGrade(item)} style={[styles.choice, grade === item && styles.choiceActive]}>Lớp {item}</Text>)}</View>
      <EntityList items={data || []} titleKeys={['title', 'name', 'lessonId']} subtitleKeys={['description', 'stageCount', 'classId']} tagKey="lessonId" emptyTitle="Chưa có lộ trình" />
    </AppScreen>
  );
};

export const AdminFeedbackScreen = () => {
  const { token } = useAuth();
  const { data, reload } = useApiResource<Record<string, unknown>[]>('/admin/feedback', { auth: true });
  const approve = async (id: string) => {
    await api.patch(`/admin/feedback/${id}/approve`, {}, { token });
    reload();
  };
  return (
    <AppScreen title="Phản hồi & duyệt giáo viên" subtitle="Feedback manager và teacher request approval.">
      <EntityList
        items={data || []}
        titleKeys={['title', 'username', 'email', 'id']}
        subtitleKeys={['content', 'message', 'proofImageUrl', 'status']}
        tagKey="status"
        emptyTitle="Chưa có phản hồi"
        onPress={(item) => Alert.alert('Xử lý phản hồi', String(item.content || item.message || item.email || item.id), [
          { text: 'Đóng' },
          { text: 'Duyệt', onPress: () => approve(String(item.id)) },
        ])}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stat: {
    color: colors.green,
    fontSize: 28,
    fontWeight: font.heavy,
  },
  label: {
    color: colors.muted,
    fontWeight: font.bold,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: font.heavy,
  },
  body: {
    color: colors.muted,
    lineHeight: 20,
    fontWeight: font.medium,
  },
  choiceRow: {
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
});
