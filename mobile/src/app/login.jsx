import React from 'react';
import { Link, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../components/ui/AppButton';
import Screen from '../components/ui/Screen';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/api';
import { colors, shadow } from '../theme';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);

  const canSubmit = username.trim().length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await login(username.trim(), password);
      router.replace('/home');
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboard}
    >
      <Screen eyebrow="AURUM Mobile" title="Dang nhap">
        <View style={[styles.panel, shadow]}>
          <Text style={styles.brand}>AURUM</Text>
          <Text style={styles.copy}>
            Vao hoc vien bang tai khoan AURUM hien co de dong bo lop hoc, nhiem vu va ho so.
          </Text>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setUsername}
            placeholder="Ten dang nhap hoac email"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={username}
          />
          <TextInput
            onChangeText={setPassword}
            placeholder="Mat khau"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            style={styles.input}
            value={password}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <AppButton disabled={!canSubmit} loading={submitting} onPress={handleLogin}>
            Nhap hoc
          </AppButton>

          <Link href="/register" style={styles.link}>
            Chua co tai khoan? Dang ky hoc vien moi
          </Link>
        </View>

        <Text style={styles.endpoint}>API: {API_BASE_URL}</Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
  },
  copy: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  endpoint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#ffffff',
    color: colors.ink,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  keyboard: {
    flex: 1,
  },
  link: {
    color: colors.violet,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  panel: {
    gap: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 20,
  },
});
