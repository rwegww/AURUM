import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getRoleHomeRoute, REMEMBER_EMAIL_KEY } from '@aurum/shared/auth';
import { useAuth } from '@/auth/AuthProvider';
import { mobileStorage } from '@/lib/storage';
import { Card, PrimaryButton, TextField } from '@/components/Primitives';
import { colors, font, spacing } from '@/theme';

export default function LoginScreen() {
  const params = useLocalSearchParams<{ token?: string; error?: string }>();
  const { login, loginWithGoogle, magicLogin, authError, setAuthError, isLoggedIn, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    mobileStorage.getItem(REMEMBER_EMAIL_KEY).then((saved) => {
      if (saved) {
        setEmail(saved);
        setRememberEmail(true);
      }
    });
  }, []);

  useEffect(() => {
    if (params.error) setLocalError(String(params.error));
    if (params.token) {
      setLoading(true);
      magicLogin(String(params.token)).then((result) => {
        setLoading(false);
        if (result.success && result.user) router.replace(getRoleHomeRoute(result.user.role) as never);
        else setLocalError(result.message || 'Link đăng nhập không hợp lệ.');
      });
    }
  }, [magicLogin, params.error, params.token]);

  useEffect(() => {
    if (!authLoading && isLoggedIn && user) router.replace(getRoleHomeRoute(user.role) as never);
  }, [authLoading, isLoggedIn, user]);

  const submit = async () => {
    setLoading(true);
    setLocalError(null);
    setAuthError(null);
    const result = await login(email.trim(), password, rememberEmail);
    setLoading(false);
    if (result.success && result.user) router.replace(getRoleHomeRoute(result.user.role) as never);
    else setLocalError(result.message || 'Sai tài khoản hoặc mật khẩu.');
  };

  const google = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);
    if (result.success && result.user) router.replace(getRoleHomeRoute(result.user.role) as never);
    else setLocalError(result.message || 'Không thể đăng nhập Google.');
  };

  return (
    <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.hero}>
        <View style={styles.logo}><Text style={styles.logoText}>Au</Text></View>
        <Text style={styles.title}>AURUM</Text>
        <Text style={styles.subtitle}>Học hóa học, làm nhiệm vụ, vào lab và quản lý lớp ngay trên mobile.</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Đăng nhập</Text>
        {(localError || authError) ? <Text style={styles.error}>{localError || authError}</Text> : null}
        <TextField label="Email hoặc username" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="hocvien@email.com" />
        <TextField label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
        <PrimaryButton title="Đăng nhập" onPress={submit} loading={loading} disabled={!email || !password} />
        <PrimaryButton title="Đăng nhập Google" onPress={google} tone="ghost" loading={loading} />
        <PrimaryButton
          title={rememberEmail ? 'Đang ghi nhớ email' : 'Ghi nhớ email'}
          tone={rememberEmail ? 'blue' : 'ghost'}
          onPress={() => setRememberEmail((prev) => !prev)}
        />
        <Text style={styles.link} onPress={() => router.push('/register')}>Chưa có tài khoản? Đăng ký ngay</Text>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: font.heavy,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: font.heavy,
  },
  subtitle: {
    color: colors.muted,
    fontWeight: font.medium,
    textAlign: 'center',
    lineHeight: 21,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: font.heavy,
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
