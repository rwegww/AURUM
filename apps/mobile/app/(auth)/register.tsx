import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useAuth } from '@/auth/AuthProvider';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Card, PrimaryButton, Tag, TextField } from '@/components/Primitives';
import { colors, font, spacing } from '@/theme';

export default function RegisterScreen() {
  const { register, registerTeacher } = useAuth();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [grade, setGrade] = useState('8');
  const [proof, setProof] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickProof = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true });
    if (!result.canceled) setProof(result.assets[0]);
  };

  const submit = async () => {
    setError(null);
    if (password !== confirm) return setError('Mật khẩu xác nhận không khớp.');
    if (password.length < 6) return setError('Mật khẩu phải có ít nhất 6 ký tự.');
    setLoading(true);
    try {
      if (role === 'teacher') {
        if (!proof) {
          setLoading(false);
          return setError('Vui lòng chọn tài liệu minh chứng.');
        }
        const uploaded = await uploadToCloudinary(proof, 'chemistry-odyssey/teacher-proofs');
        const result = await registerTeacher(username, password, email, uploaded.secure_url || uploaded.url || '');
        if (!result.success) setError(result.message || 'Không thể gửi yêu cầu giáo viên.');
        else {
          Alert.alert('Đã gửi yêu cầu', result.message || 'Quản trị viên sẽ xét duyệt qua email.');
          router.replace('/login');
        }
      } else {
        const result = await register(username, password, email, 'student', '', grade);
        if (!result.success) setError(result.message || 'Không thể đăng ký.');
        else router.replace('/login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đăng ký.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>Chọn vai trò, hoàn tất thông tin và bắt đầu hành trình AURUM.</Text>
        <Card>
          <View style={styles.roleRow}>
            <PrimaryButton title="Học sinh" onPress={() => setRole('student')} tone={role === 'student' ? 'green' : 'ghost'} />
            <PrimaryButton title="Giáo viên" onPress={() => setRole('teacher')} tone={role === 'teacher' ? 'blue' : 'ghost'} />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextField label="Username" value={username} onChangeText={setUsername} placeholder="Tên đăng nhập" />
          <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="hocvien@email.com" />
          <TextField label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
          <TextField label="Xác nhận mật khẩu" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="••••••••" />
          {role === 'student' ? (
            <View style={styles.gradeWrap}>
              {['8', '9', '10', '11', '12'].map((item) => (
                <Text key={item} onPress={() => setGrade(item)} style={[styles.grade, grade === item && styles.gradeActive]}>Lớp {item}</Text>
              ))}
            </View>
          ) : (
            <View style={styles.proofBox}>
              <Tag tone={proof ? 'green' : 'muted'}>{proof?.name || 'Chưa chọn minh chứng'}</Tag>
              <PrimaryButton title="Chọn tệp minh chứng" onPress={pickProof} tone="ghost" />
            </View>
          )}
          <PrimaryButton title={role === 'teacher' ? 'Gửi yêu cầu giáo viên' : 'Đăng ký học sinh'} onPress={submit} loading={loading} />
          <Text style={styles.link} onPress={() => router.replace('/login')}>Đã có tài khoản? Đăng nhập</Text>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: font.heavy,
    marginTop: spacing.xl,
  },
  subtitle: {
    color: colors.muted,
    fontWeight: font.medium,
    lineHeight: 21,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  gradeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  grade: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    color: colors.muted,
    backgroundColor: '#f3f4f6',
    fontWeight: font.heavy,
  },
  gradeActive: {
    backgroundColor: colors.green,
    color: '#fff',
  },
  proofBox: {
    gap: spacing.sm,
  },
  error: {
    color: colors.red,
    fontWeight: font.bold,
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    padding: spacing.sm,
  },
  link: {
    color: colors.green,
    fontWeight: font.heavy,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
