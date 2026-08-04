import { describe, expect, it, vi } from 'vitest';
import {
  GOOGLE_OAUTH_PENDING_KEY,
  clearGoogleOAuthPending,
  prepareGoogleOAuth,
  waitForSupabaseSession,
} from '../src/utils/googleOAuth.js';

const createStorage = (initial = {}) => {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
};

describe('luồng đăng nhập Google', () => {
  it('xóa phiên ứng dụng cũ trước khi chuyển sang Google', () => {
    const local = createStorage({ token: 'old-token', sessionId: 'old-session', userId: 'old-user', authType: 'custom' });
    const session = createStorage();

    prepareGoogleOAuth({ local, session });

    expect(local.getItem('token')).toBeNull();
    expect(local.getItem('sessionId')).toBeNull();
    expect(local.getItem('userId')).toBeNull();
    expect(local.getItem('authType')).toBe('supabase');
    expect(session.getItem(GOOGLE_OAUTH_PENDING_KEY)).not.toBeNull();
    clearGoogleOAuthPending(session);
    expect(session.getItem(GOOGLE_OAUTH_PENDING_KEY)).toBeNull();
  });

  it('đợi sự kiện phiên mới thay vì kết luận hết hạn khi getSession tạm thời trả null', async () => {
    let notifyAuthChange;
    const unsubscribe = vi.fn();
    const supabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn((listener) => {
          notifyAuthChange = listener;
          return { data: { subscription: { unsubscribe } } };
        }),
      },
    };
    const waiting = waitForSupabaseSession(supabase, { timeoutMs: 100 });
    await Promise.resolve();
    notifyAuthChange('SIGNED_IN', { access_token: 'new-google-token' });

    await expect(waiting).resolves.toEqual({ access_token: 'new-google-token' });
    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it('trả lỗi rõ ràng nếu callback không bao giờ nhận được phiên', async () => {
    const unsubscribe = vi.fn();
    const supabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe } } })),
      },
    };

    await expect(waitForSupabaseSession(supabase, { timeoutMs: 5 }))
      .rejects.toThrow('Không nhận được phiên đăng nhập Google');
    expect(unsubscribe).toHaveBeenCalledOnce();
  });
});
