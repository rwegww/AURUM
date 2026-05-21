import React from 'react';
import { Link, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../components/ui/AppButton';
import Screen from '../components/ui/Screen';
import { useAuth } from '../context/AuthContext';
import { colors, shadow } from '../theme';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = React.useState({
    email: '',
    grade: '',
    password: '',
    username: '',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);

  const updateField = (field) => (value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const canSubmit =
    form.username.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.password.length >= 6;

  const handleRegister = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await register({
        email: form.email.trim(),
        grade: form.grade.trim(),
        password: form.password,
        username: form.username.trim(),
      });
      router.replace('/home');
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboard}
    >
      <Screen eyebrow="Hoc vien moi" title="Dang ky">
        <View style={[styles.panel, shadow]}>
          <Text style={styles.copy}>
            Tao tai khoan hoc sinh de bat dau theo doi tien do, tham gia lop va nhan nhiem vu.
          </Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={updateField('username')}
            placeholder="Ten dang nhap"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={form.username}
          />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={updateField('email')}
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={form.email}
          />
          <TextInput
            keyboardType="number-pad"
            onChangeText={updateField('grade')}
            placeholder="Lop hien tai (tuy chon)"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={form.grade}
          />
          <TextInput
            onChangeText={updateField('password')}
            placeholder="Mat khau toi thieu 6 ky tu"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            style={styles.input}
            value={form.password}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <AppButton disabled={!canSubmit} loading={submitting} onPress={handleRegister}>
            Tao tai khoan
          </AppButton>

          <Link href="/login" style={styles.link}>
            Da co tai khoan? Dang nhap
          </Link>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  copy: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
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
