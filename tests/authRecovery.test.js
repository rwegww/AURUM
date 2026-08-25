import express from 'express';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isValidNewPassword } from '../shared/passwordPolicy.js';

process.env.JWT_SECRET = 'isolated-auth-audit-secret';
process.env.NODE_ENV = 'test';
const oldPassword = 'existing-password';
const newPassword = 'new-password-for-audit';
const originalHash = bcrypt.hashSync(oldPassword, 10);
let account;
const userModel = {
  findOne: vi.fn(), findById: vi.fn(), create: vi.fn(), update: vi.fn(),
  comparePassword: vi.fn((plain, hash) => bcrypt.compare(plain, hash)),
};
const security = {
  limit: vi.fn(), issue: vi.fn(), complete: vi.fn(), createSession: vi.fn(), changePassword: vi.fn(),
  logout: vi.fn(), oauthSessionActive: vi.fn(), waitForEmailResponse: vi.fn(),
};
const mailer = { sendLoginOtpEmail: vi.fn(), sendPasswordResetOtpEmail: vi.fn() };
const supabase = { auth: { getUser: vi.fn(), admin: { signOut: vi.fn() } }, from: vi.fn(), rpc: vi.fn() };
vi.mock('../api/_models/User.js', () => ({ default: userModel }));
vi.mock('../api/_lib/supabase.js', () => ({ supabase }));
vi.mock('../api/_lib/mailer.js', () => mailer);
vi.mock('../api/_lib/authSecurity.js', async (importOriginal) => ({ ...(await importOriginal()), AuthSecurity: security }));
const { default: authRouter } = await import('../api/_routes/auth.js');
const { default: userRouter } = await import('../api/_routes/user.js');
const { authenticateToken } = await import('../api/_middleware/auth.js');
const app = express();
app.use(express.json()); app.use('/api/auth', authRouter); app.use('/api/user', userRouter);
const sessionToken = () => jwt.sign({ id: account.id, sessionId: account.currentSessionId }, process.env.JWT_SECRET);

beforeEach(() => {
  vi.clearAllMocks();
  account = { id: 'fixture-student', username: 'fixture', email: 'fixture@example.invalid', role: 'student', password: originalHash, currentSessionId: 'fixture-current-session', isLocked: false };
  userModel.findOne.mockImplementation(async ({ username, email, googleId }) => !googleId && (username === account.username || email === account.email) ? { ...account } : null);
  userModel.findById.mockImplementation(async (id) => id === account.id ? { ...account } : null);
  security.limit.mockResolvedValue(undefined);
  security.issue.mockResolvedValue({ issued: true, user_id: account.id, username: account.username });
  security.complete.mockResolvedValue(null);
  security.createSession.mockImplementation(async (user, sessionId) => {
    if (user.password !== account.password || account.isLocked) return false;
    account.currentSessionId = sessionId; return true;
  });
  security.changePassword.mockImplementation(async (_user, hash) => {
    account.password = hash; account.currentSessionId = null; return true;
  });
  security.logout.mockImplementation(async () => { account.currentSessionId = null; });
  security.oauthSessionActive.mockResolvedValue(true);
  security.waitForEmailResponse.mockResolvedValue(undefined);
  mailer.sendPasswordResetOtpEmail.mockResolvedValue({ success: true, previewUrl: 'https://example.invalid/secret-mailbox' });
  mailer.sendLoginOtpEmail.mockResolvedValue({ success: true });
  supabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
});

describe('login and credential changes', () => {
  it('normalizes email and returns a server-created session id', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: '  FIXTURE@EXAMPLE.INVALID ', password: oldPassword });
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toBe('no-store');
    expect(jwt.verify(res.body.token, process.env.JWT_SECRET).sessionId).toBe(res.body.sessionId);
    expect(res.body.sessionId).toBe(account.currentSessionId);
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('returns identical failures for unknown accounts and wrong passwords and compares both', async () => {
    const missing = await request(app).post('/api/auth/login').send({ username: 'missing', password: 'wrong-password' });
    const incorrect = await request(app).post('/api/auth/login').send({ username: account.username, password: 'wrong-password' });
    expect(missing.status).toBe(incorrect.status);
    expect(missing.body).toEqual(incorrect.body);
    expect(userModel.comparePassword).toHaveBeenCalledTimes(2);
    expect(security.createSession).not.toHaveBeenCalled();
  });

  it('fails closed when the persistent throttle is unavailable', async () => {
    security.limit.mockRejectedValueOnce(new Error('database unavailable'));
    const res = await request(app).post('/api/auth/login').send({ username: account.username, password: oldPassword });
    expect(res.status).toBe(500);
    expect(userModel.comparePassword).not.toHaveBeenCalled();
    expect(res.body.message).not.toContain('database');
  });

  it('uses Retry-After and does not verify a password after throttling', async () => {
    security.limit.mockRejectedValueOnce(Object.assign(new Error('Chờ thử lại.'), { status: 429, expose: true, retryAfter: 60 }));
    const res = await request(app).post('/api/auth/login').send({ username: account.username, password: oldPassword });
    expect(res.status).toBe(429); expect(res.headers['retry-after']).toBe('60');
    expect(userModel.comparePassword).not.toHaveBeenCalled();
  });

  it('cannot mint a session if credentials change during password verification', async () => {
    security.createSession.mockResolvedValueOnce(false);
    const res = await request(app).post('/api/auth/login').send({ username: account.username, password: oldPassword });
    expect(res.status).toBe(401); expect(res.body).not.toHaveProperty('token');
  });

  it('rejects password writes through the profile endpoint', async () => {
    const res = await request(app).patch('/api/user/profile').set('Authorization', `Bearer ${sessionToken()}`).send({ password: newPassword });
    expect(res.status).toBe(400); expect(userModel.update).not.toHaveBeenCalled();
  });

  it('does not let profile reads overwrite the server session', async () => {
    const res = await request(app).get('/api/user/profile?claim=true').set('Authorization', `Bearer ${sessionToken()}`).set('X-Session-ID', 'attacker-chosen-value');
    expect(res.status).toBe(200); expect(userModel.update).not.toHaveBeenCalled();
  });

  it('requires the current password and rejects an incorrect one', async () => {
    for (const currentPassword of [undefined, 'not-the-current-password']) {
      const res = await request(app).post('/api/auth/change-password').set('Authorization', `Bearer ${sessionToken()}`).send({ currentPassword, newPassword });
      expect(res.status).toBe(400);
    }
    expect(security.changePassword).not.toHaveBeenCalled();
  });

  it('stores a bcrypt hash and invalidates the old JWT after changing password', async () => {
    const oldToken = sessionToken();
    const res = await request(app).post('/api/auth/change-password').set('Authorization', `Bearer ${oldToken}`).send({ currentPassword: oldPassword, newPassword });
    expect(res.status).toBe(200);
    expect(await bcrypt.compare(newPassword, account.password)).toBe(true);
    await expect(authenticateToken(oldToken)).rejects.toMatchObject({ code: 'INVALID_SESSION' });
  });

  it('revokes the custom session on logout', async () => {
    const token = sessionToken();
    expect((await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${token}`)).status).toBe(200);
    await expect(authenticateToken(token)).rejects.toMatchObject({ code: 'INVALID_SESSION' });
  });

  it('retires reusable magic JWTs even if they remain cryptographically valid', async () => {
    const token = jwt.sign({ id: account.id, magicLogin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const res = await request(app).post('/api/auth/magic-login').send({ token });
    expect(res.status).toBe(410); expect(security.createSession).not.toHaveBeenCalled();
  });
});

describe('email recovery', () => {
  it('uses identical responses for real, missing, locked, cooldown and delivery-failure cases', async () => {
    const responses = [];
    for (const issued of [
      { issued: true, user_id: account.id, username: account.username },
      { issued: true, user_id: null }, { issued: false, user_id: account.id },
    ]) {
      security.issue.mockResolvedValueOnce(issued);
      responses.push(await request(app).post('/api/auth/forgot-password').send({ email: account.email }));
    }
    mailer.sendPasswordResetOtpEmail.mockResolvedValueOnce({ success: false, error: 'private smtp detail' });
    responses.push(await request(app).post('/api/auth/forgot-password').send({ email: account.email }));
    for (const res of responses) { expect(res.status).toBe(200); expect(res.body).toEqual(responses[0].body); }
    expect(JSON.stringify(responses[0].body)).not.toMatch(/previewUrl|secret-mailbox|smtp/);
    expect(security.waitForEmailResponse).toHaveBeenCalledTimes(4);
    expect(userModel.update).not.toHaveBeenCalled();
  });

  it('uses the reset purpose and does not accept weak or truncated passwords', async () => {
    for (const password of ['short', 'a'.repeat(73), 'ệ'.repeat(25), 'supabase_oauth_no_password']) {
      const res = await request(app).post('/api/auth/reset-password').send({ email: account.email, otp: '123456', newPassword: password });
      expect(res.status).toBe(400);
    }
    expect(security.complete).not.toHaveBeenCalled();
    expect(isValidNewPassword('a'.repeat(72))).toBe(true);
    expect(isValidNewPassword('ệ'.repeat(24))).toBe(true);
  });

  it('handles an invalid, expired or replayed code without issuing a session', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({ email: account.email, otp: '123456', newPassword });
    expect(res.status).toBe(400); expect(res.body.error).toBe('INVALID_CHALLENGE');
    expect(security.complete.mock.calls[0].slice(0,3)).toEqual([account.email, 'reset', '123456']);
    expect(res.body).not.toHaveProperty('token');
  });

  it('resets via the atomic RPC and requires a separate password login', async () => {
    security.complete.mockImplementationOnce(async (_email, _purpose, _code, hash) => {
      expect(await bcrypt.compare(newPassword, hash)).toBe(true);
      return { user_id: account.id };
    });
    const res = await request(app).post('/api/auth/reset-password').send({ email: account.email, otp: '123456', newPassword });
    expect(res.status).toBe(200); expect(res.body).not.toHaveProperty('token');
    expect(security.createSession).not.toHaveBeenCalled();
  });

  it('returns exactly the session consumed atomically with the login OTP', async () => {
    security.complete.mockResolvedValueOnce({ user_id: account.id, session_id: 'atomic-otp-session' });
    const res = await request(app).post('/api/auth/verify-otp').send({ email: account.email, otp: '123456' });
    expect(res.status).toBe(200); expect(res.body.sessionId).toBe('atomic-otp-session');
    expect(security.createSession).not.toHaveBeenCalled();
  });
});

describe('Google identity and session validation', () => {
  it('rejects linking an arbitrary client-supplied Google id and email', async () => {
    const res = await request(app).post('/api/user/link-account').set('Authorization', `Bearer ${sessionToken()}`)
      .send({ provider: 'google', accountId: 'forged-id', providerEmail: account.email });
    expect(res.status).toBe(400); expect(userModel.update).not.toHaveBeenCalled();
  });

  it('uses the verified Google identity and ignores forged id/email fields', async () => {
    supabase.auth.getUser.mockResolvedValueOnce({ data: { user: {
      id: 'verified-google-id', email: account.email, email_confirmed_at: '2026-01-01', identities: [{ provider: 'google' }],
    } }, error: null });
    const res = await request(app).post('/api/user/link-account').set('Authorization', `Bearer ${sessionToken()}`)
      .send({ provider: 'google', providerAccessToken: 'verified-oauth-token', accountId: 'forged-id', providerEmail: 'forged@example.invalid' });
    expect(res.status).toBe(200);
    expect(userModel.update).toHaveBeenCalledWith(account.id, { linkedAccounts: { google: 'verified-google-id' } });
  });

  it('does not merge a pre-registered password account by email during Google login', async () => {
    supabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: 'other-oauth-id', email: account.email, email_confirmed_at: '2026-01-01' } }, error: null });
    await expect(authenticateToken('oauth-token')).rejects.toMatchObject({ code: 'ACCOUNT_LINK_REQUIRED' });
  });

  it('rejects a Supabase token whose backing session has been revoked', async () => {
    security.oauthSessionActive.mockResolvedValueOnce(false);
    supabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: account.id, email: account.email } }, error: null });
    await expect(authenticateToken('oauth-token')).rejects.toMatchObject({ code: 'INVALID_SESSION' });
  });
});
