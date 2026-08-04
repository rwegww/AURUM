import React from 'react';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Card, GhostButton, PrimaryButton, Screen, TextField } from '../../components/ui/Primitives';
import { authApi } from '../../services/api';
import { colors, spacing } from '../../constants/theme';
import { isValidNewPassword, PASSWORD_POLICY_MESSAGE } from '../../../../shared/passwordPolicy';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmation, setConfirmation] = React.useState('');
  const [step, setStep] = React.useState('email');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [cooldown, setCooldown] = React.useState(0);

  React.useEffect(() => {
    if (!cooldown) return undefined;
    const timer = setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const requestCode = async () => {
    if (busy || cooldown) return;
    setBusy(true); setError('');
    try {
      const normalized = email.trim().toLowerCase();
      const result = await authApi.forgotPassword(normalized);
      setEmail(normalized); setOtp(''); setStep('reset');
      setNotice(result.message); setCooldown(result.retryAfter || 60);
    } catch (err) {
      setError(err.message);
      if (err.payload?.retryAfter) setCooldown(err.payload.retryAfter);
    } finally { setBusy(false); }
  };

  const reset = async () => {
    if (busy) return;
    setError('');
    if (!/^\d{6}$/.test(otp)) return setError('Mã xác thực phải gồm 6 chữ số.');
    if (!isValidNewPassword(password)) return setError(PASSWORD_POLICY_MESSAGE);
    if (password !== confirmation) return setError('Mật khẩu xác nhận không khớp.');
    setBusy(true);
    try {
      const result = await authApi.resetPassword(email, otp, password);
      setPassword(''); setConfirmation(''); setOtp('');
      setNotice(result.message); setStep('done');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return <Screen><Card style={{ gap: spacing.md, marginTop: spacing.xl }}>
    <Text style={{ fontSize: 26, fontWeight: '800', color: colors.ink }}>Khôi phục mật khẩu</Text>
    <Text style={{ color: colors.muted }}>Nhận mã qua email của tài khoản. Mã dùng một lần và hết hạn sau 10 phút.</Text>
    {notice ? <Text accessibilityRole="alert" style={{ color: colors.greenDark }}>{notice}</Text> : null}
    {error ? <Text accessibilityRole="alert" style={{ color: colors.red }}>{error}</Text> : null}
    {step !== 'done' && <>
      <TextField placeholder="Email tài khoản" accessibilityLabel="Email tài khoản" keyboardType="email-address"
        autoCapitalize="none" autoComplete="email" value={email} onChangeText={setEmail} editable={!busy && step === 'email'} />
      {step === 'reset' && <View style={{ gap: spacing.md }}>
        <TextField placeholder="Mã gồm 6 chữ số" accessibilityLabel="Mã xác thực" keyboardType="number-pad"
          autoComplete="one-time-code" maxLength={6} value={otp} onChangeText={(value) => setOtp(value.replace(/\D/g, ''))} editable={!busy} />
        <Text style={{ color: colors.muted }}>{PASSWORD_POLICY_MESSAGE}</Text>
        <TextField placeholder="Mật khẩu mới" accessibilityLabel="Mật khẩu mới" secureTextEntry autoComplete="new-password"
          value={password} onChangeText={setPassword} editable={!busy} />
        <TextField placeholder="Xác nhận mật khẩu mới" accessibilityLabel="Xác nhận mật khẩu mới" secureTextEntry autoComplete="new-password"
          value={confirmation} onChangeText={setConfirmation} editable={!busy} />
      </View>}
      <PrimaryButton label={busy ? 'Đang xử lý…' : step === 'email' ? 'Gửi mã xác thực' : 'Lưu mật khẩu mới'}
        onPress={step === 'email' ? requestCode : reset} disabled={busy || (step === 'email' && cooldown > 0)} />
      {step === 'reset' && <>
        <GhostButton label={cooldown ? `Gửi lại sau ${cooldown}s` : 'Gửi lại mã'} onPress={requestCode} disabled={busy || cooldown > 0} />
        <GhostButton label="Đổi email" disabled={busy} onPress={() => {
          setStep('email'); setOtp(''); setPassword(''); setConfirmation(''); setNotice(''); setError('');
        }} />
      </>}
    </>}
    <Link href="/login" asChild><GhostButton label="Quay lại đăng nhập" /></Link>
  </Card></Screen>;
}
