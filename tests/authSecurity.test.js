import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const rpc = vi.fn();
vi.mock('../api/lib/supabase.js', () => ({ supabase: { rpc } }));
const { AuthSecurity, hashChallenge, clientAddress } = await import('../api/lib/authSecurity.js');
const req = { ip: '192.0.2.1', get: (header) => header === 'x-forwarded-for' ? '198.51.100.2' : undefined };
beforeEach(() => { vi.clearAllMocks(); vi.stubEnv('JWT_SECRET','fixture-secret'); rpc.mockResolvedValue({ data: 0, error: null }); });
afterEach(() => vi.unstubAllEnvs());

describe('persistent authentication helpers', () => {
  it('separates hashes by email and purpose and has no fallback secret', () => {
    const first = hashChallenge('one@example.invalid','login','123456');
    expect(first).toMatch(/^[a-f0-9]{64}$/);
    expect(hashChallenge('one@example.invalid','reset','123456')).not.toBe(first);
    expect(hashChallenge('two@example.invalid','login','123456')).not.toBe(first);
    vi.stubEnv('JWT_SECRET','');
    expect(() => hashChallenge('one@example.invalid','login','123456')).toThrow();
  });
  it('stores HMAC rate keys instead of raw email or IP and checks both buckets', async () => {
    await AuthSecurity.limit(req, 'login','one@example.invalid');
    expect(rpc).toHaveBeenCalledTimes(2);
    for (const [,parameters] of rpc.mock.calls) {
      expect(parameters.p_key).toMatch(/^[a-f0-9]{64}$/);
      expect(JSON.stringify(parameters)).not.toContain('example.invalid');
    }
  });
  it('stops after a refused IP bucket', async () => {
    rpc.mockResolvedValueOnce({ data: 37, error: null });
    await expect(AuthSecurity.limit(req,'login','name')).rejects.toMatchObject({ status: 429, retryAfter: 37 });
    expect(rpc).toHaveBeenCalledTimes(1);
  });
  it.each([null, -1, '0', undefined])('fails closed on an invalid rate RPC result: %s', async (data) => {
    rpc.mockResolvedValueOnce({ data, error: null });
    await expect(AuthSecurity.limit(req,'login','name')).rejects.toThrow('Invalid rate limit result');
  });
  it('does not accept a spoofed forwarding header outside Vercel', () => {
    vi.stubEnv('VERCEL','');
    expect(clientAddress(req)).toBe(req.ip);
    vi.stubEnv('VERCEL','1');
    expect(clientAddress({ ...req, get: () => '198.51.100.2' })).toBe('198.51.100.2');
    expect(clientAddress({ ...req, get: () => '198.51.100.2, 203.0.113.3' })).toBe(req.ip);
  });
  it('rejects absent OAuth session identifiers without querying the database', async () => {
    expect(await AuthSecurity.oauthSessionActive(undefined,'user','profile')).toBe(false);
    expect(rpc).not.toHaveBeenCalled();
  });
});
