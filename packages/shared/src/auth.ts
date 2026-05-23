import type { AurumRole } from './types';

export const TOKEN_KEY = 'token';
export const AUTH_TYPE_KEY = 'authType';
export const SESSION_ID_KEY = 'sessionId';
export const USER_ID_KEY = 'userId';
export const REMEMBER_EMAIL_KEY = 'rememberEmail';

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    if (typeof atob !== 'function') return null;
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const createClientSessionId = (token?: string | null) => {
  if (token) {
    const payload = decodeJwtPayload(token);
    if (typeof payload?.sessionId === 'string') return payload.sessionId;
  }

  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
};

export const getRoleHomeRoute = (role?: AurumRole | string | null) => {
  if (role === 'admin') return '/admin';
  if (role === 'teacher') return '/teacher';
  return '/';
};

export const isPrivilegedRole = (role?: string | null) => role === 'admin' || role === 'teacher';
