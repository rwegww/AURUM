import crypto from 'node:crypto';
import net from 'node:net';
import { supabase } from './supabase.js';

export const normalizeEmail = (email) => typeof email === 'string' ? email.trim().toLowerCase() : '';
export const isValidEmail = (email) => email.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const authSecret = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required for authentication');
  return process.env.JWT_SECRET;
};

const digest = (value) => crypto.createHmac('sha256', authSecret()).update(value).digest('hex');
export const hashChallenge = (email, purpose, code) => digest(JSON.stringify(['otp', email, purpose, code]));

const call = async (name, parameters) => {
  const { data, error } = await supabase.rpc(name, parameters);
  if (error) throw error;
  return data;
};

// Never trust arbitrary X-Forwarded-For. Vercel overwrites its dedicated header;
// other hosts can configure Express trust proxy to their exact proxy addresses.
export const clientAddress = (req) => {
  const vercelAddress = process.env.VERCEL === '1' ? req.get('x-vercel-forwarded-for') : null;
  return vercelAddress && net.isIP(vercelAddress) ? vercelAddress : (req.ip || req.socket?.remoteAddress || 'unknown');
};

export const AuthSecurity = {
  async waitForEmailResponse(deadline) {
    const delay = Math.max(0, deadline - Date.now());
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
  },

  async limit(req, scope, identity, { account = 10, ip = 50, seconds = 900 } = {}) {
    for (const [kind, value, limit] of [['ip', clientAddress(req), ip], ['account', identity, account]]) {
      const retryAfter = await call('consume_auth_rate_limit', {
        p_key: digest(JSON.stringify(['rate', scope, kind, value])),
        p_limit: limit,
        p_window_seconds: seconds,
      });
      if (!Number.isInteger(retryAfter) || retryAfter < 0) throw new Error('Invalid rate limit result');
      if (retryAfter > 0) {
        const error = new Error('Bạn đã thử quá nhiều lần. Vui lòng chờ rồi thử lại.');
        Object.assign(error, { status: 429, code: 'AUTH_RATE_LIMITED', expose: true, retryAfter });
        throw error;
      }
    }
  },

  issue(email, purpose, code) {
    return call('issue_auth_challenge', {
      p_email: email, p_purpose: purpose, p_token_hash: hashChallenge(email, purpose, code),
      p_challenge_id: crypto.randomUUID(),
    });
  },

  complete(email, purpose, code, passwordHash = null) {
    return call('complete_auth_challenge', {
      p_email: email, p_purpose: purpose, p_token_hash: hashChallenge(email, purpose, code),
      p_password_hash: passwordHash, p_session_id: crypto.randomUUID(),
    });
  },

  async createSession(user, sessionId) {
    return await call('create_auth_session', {
      p_user_id: user.id, p_expected_password_hash: user.password, p_session_id: sessionId,
    }) === true;
  },

  async changePassword(user, passwordHash) {
    const { data, error } = await supabase.from('nguoi_dung')
      .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
      .eq('id', user.id).eq('password_hash', user.password).eq('bi_khoa', false)
      .select('id').maybeSingle();
    if (error) throw error;
    return Boolean(data);
  },

  async logout(userId, sessionId) {
    const { error } = await supabase.from('nguoi_dung')
      .update({ current_session_id: null, auth_invalid_before: new Date().toISOString() }).eq('id', userId).eq('current_session_id', sessionId);
    if (error) throw error;
  },

  async oauthSessionActive(sessionId, authUserId, userId) {
    if (typeof sessionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(sessionId)) return false;
    return await call('is_oauth_session_active', {
      p_session_id: sessionId, p_auth_user_id: authUserId, p_user_id: userId,
    }) === true;
  },
};
