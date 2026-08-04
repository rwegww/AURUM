import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/context/AuthContext';
import { isValidNewPassword, PASSWORD_POLICY_MESSAGE } from '../../../shared/passwordPolicy.js';

const fieldClass = 'w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-viet-green focus:ring-2 focus:ring-viet-green/10';

export default function ForgotPassword() {
  const { logout } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return undefined;
    const timer = setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const requestCode = async () => {
    if (busy || cooldown) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.retryAfter) setCooldown(data.retryAfter);
        throw new Error(data.message || 'Không thể gửi mã lúc này.');
      }
      setEmail(email.trim().toLowerCase());
      setOtp('');
      setStep('reset');
      setCooldown(data.retryAfter || 60);
      setNotice(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (step === 'email') return requestCode();
    setError('');
    if (!isValidNewPassword(password)) return setError(PASSWORD_POLICY_MESSAGE);
    if (password !== confirmation) return setError('Mật khẩu xác nhận không khớp.');
    setBusy(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không thể đặt lại mật khẩu.');
      setPassword('');
      setConfirmation('');
      setOtp('');
      setNotice(data.message);
      await logout({ redirectTo: '/login?reset=success' });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-slate-800">{step === 'email' ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}</h1>
      <p className="mt-2 mb-6 text-sm leading-6 text-slate-500">Nhận mã qua email của tài khoản, rồi chọn mật khẩu mới. Mã có hiệu lực 10 phút và chỉ dùng được một lần.</p>
      {notice && <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="recovery-email" className="text-sm font-bold">Email tài khoản</label>
          <input id="recovery-email" type="email" autoComplete="email" maxLength={320} required className={fieldClass}
            value={email} disabled={busy || step === 'reset'} onChange={(event) => setEmail(event.target.value)} />
        </div>
        {step === 'reset' && <>
          <div className="space-y-2">
            <label htmlFor="recovery-otp" className="text-sm font-bold">Mã xác thực</label>
            <input id="recovery-otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6}
              required className={fieldClass} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} disabled={busy} />
          </div>
          <div className="space-y-2">
            <label htmlFor="recovery-password" className="text-sm font-bold">Mật khẩu mới</label>
            <input id="recovery-password" type="password" autoComplete="new-password" required className={fieldClass}
              aria-describedby="recovery-policy" value={password} onChange={(event) => setPassword(event.target.value)} disabled={busy} />
            <p id="recovery-policy" className="text-xs leading-5 text-slate-500">{PASSWORD_POLICY_MESSAGE}</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="recovery-confirmation" className="text-sm font-bold">Xác nhận mật khẩu mới</label>
            <input id="recovery-confirmation" type="password" autoComplete="new-password" required className={fieldClass}
              value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={busy} />
          </div>
        </>}
        <button type="submit" disabled={busy || (step === 'email' && cooldown > 0)}
          className="h-12 w-full rounded-xl bg-viet-green font-bold text-white disabled:opacity-50">
          {busy ? 'Đang xử lý…' : step === 'email' ? 'Gửi mã xác thực' : 'Lưu mật khẩu mới'}
        </button>
      </form>
      {step === 'reset' && <div className="mt-4 flex justify-between gap-3 text-sm">
        <button type="button" disabled={busy || cooldown > 0} onClick={requestCode} className="font-bold text-viet-green disabled:text-slate-400">
          {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại mã'}
        </button>
        <button type="button" disabled={busy} className="text-slate-600 underline" onClick={() => {
          setStep('email'); setOtp(''); setPassword(''); setConfirmation(''); setNotice(''); setError('');
        }}>Đổi email</button>
      </div>}
      <Link to="/login" className="mt-6 block text-center text-sm font-bold text-viet-green">Quay lại đăng nhập</Link>
    </AuthLayout>
  );
}
