import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import {
  AUTH_TYPE_KEY,
  createClientSessionId,
  REMEMBER_EMAIL_KEY,
  SESSION_ID_KEY,
  TOKEN_KEY,
  USER_ID_KEY,
} from '@aurum/shared/auth';
import type { AurumUser } from '@aurum/shared/types';
import { api } from '@/lib/api';
import { mobileStorage } from '@/lib/storage';

WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
  user: AurumUser | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  authError: string | null;
  setAuthError: (message: string | null) => void;
  login: (username: string, password: string, rememberEmail?: boolean) => Promise<{ success: boolean; user?: AurumUser; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; user?: AurumUser; message?: string; redirecting?: boolean }>;
  magicLogin: (tokenParam: string) => Promise<{ success: boolean; user?: AurumUser; message?: string }>;
  register: (username: string, password: string, email: string, role?: string, teacherCode?: string, grade?: string | null) => Promise<{ success: boolean; message?: string }>;
  registerTeacher: (username: string, password: string, email: string, proofImageUrl: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (data: Record<string, unknown>) => Promise<{ success: boolean; user?: AurumUser; message?: string }>;
  completeLessonSegment: (lessonId: string, level: string, stars: number) => Promise<{ success: boolean; user?: AurumUser; message?: string }>;
  completePlacementTest: (grade: string | number) => Promise<{ success: boolean; user?: AurumUser; message?: string; xpGained?: number }>;
  recoverStreak: (streakToRestore: number) => Promise<{ success: boolean; message?: string }>;
  resetStreak: () => Promise<{ success: boolean; message?: string }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const clearSession = async () => {
  await mobileStorage.multiRemove([TOKEN_KEY, AUTH_TYPE_KEY, SESSION_ID_KEY, USER_ID_KEY]);
};

const getStoredSession = async () => {
  const [token, authType, sessionId] = await Promise.all([
    mobileStorage.getItem(TOKEN_KEY),
    mobileStorage.getItem(AUTH_TYPE_KEY),
    mobileStorage.getItem(SESSION_ID_KEY),
  ]);
  return { token, authType, sessionId };
};

const parseAuthResultUrl = (url: string) => {
  const [, hash = ''] = url.split('#');
  const query = url.includes('?') ? url.split('?')[1].split('#')[0] : '';
  const params = new URLSearchParams(hash || query);
  return {
    accessToken: params.get('access_token'),
    error: params.get('error_description') || params.get('error'),
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AurumUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const persistCustomSession = useCallback(async (nextToken: string) => {
    const sessionId = createClientSessionId(nextToken);
    await Promise.all([
      mobileStorage.setItem(TOKEN_KEY, nextToken),
      mobileStorage.setItem(AUTH_TYPE_KEY, 'custom'),
      mobileStorage.setItem(SESSION_ID_KEY, sessionId),
    ]);
    setToken(nextToken);
    return sessionId;
  }, []);

  const fetchProfile = useCallback(async (nextToken: string, claim = false) => {
    const sessionId = await mobileStorage.getItem(SESSION_ID_KEY);
    const profile = await api.get<AurumUser>(claim ? '/user/profile?claim=true' : '/user/profile', {
      token: nextToken,
      sessionId,
    });
    await mobileStorage.setItem(USER_ID_KEY, profile.id);
    if (mountedRef.current) {
      setUser(profile);
      setToken(nextToken);
    }
    return profile;
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    if (mountedRef.current) {
      setUser(null);
      setToken(null);
      setAuthError(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const stored = await getStoredSession();
    if (!stored.token) return;
    await fetchProfile(stored.token, true);
  }, [fetchProfile]);

  const login = useCallback<AuthContextValue['login']>(async (username, password, rememberEmail = false) => {
    try {
      setAuthError(null);
      const data = await api.post<{ token: string }>('/auth/login', { username, password });
      await persistCustomSession(data.token);
      if (rememberEmail) await mobileStorage.setItem(REMEMBER_EMAIL_KEY, username);
      else await mobileStorage.removeItem(REMEMBER_EMAIL_KEY);
      const profile = await fetchProfile(data.token, true);
      return { success: true, user: profile };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể đăng nhập.';
      setAuthError(message);
      return { success: false, message };
    }
  }, [fetchProfile, persistCustomSession]);

  const magicLogin = useCallback<AuthContextValue['magicLogin']>(async (tokenParam) => {
    try {
      const data = await api.post<{ token: string }>('/auth/magic-login', { token: tokenParam });
      await persistCustomSession(data.token);
      const profile = await fetchProfile(data.token, true);
      return { success: true, user: profile };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Link đăng nhập không hợp lệ.';
      return { success: false, message };
    }
  }, [fetchProfile, persistCustomSession]);

  const loginWithGoogle = useCallback<AuthContextValue['loginWithGoogle']>(async () => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return { success: false, message: 'Thiếu EXPO_PUBLIC_SUPABASE_URL cho Google OAuth.' };
    }

    try {
      const redirectUri = AuthSession.makeRedirectUri({ scheme: 'aurum', path: 'auth/callback' });
      const authUrl = `${supabaseUrl.replace(/\/+$/, '')}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUri)}&prompt=select_account`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type !== 'success') return { success: false, message: 'Đăng nhập Google đã bị hủy.' };
      const parsed = parseAuthResultUrl(result.url);
      if (parsed.error) throw new Error(parsed.error);
      if (!parsed.accessToken) throw new Error('Không nhận được access token từ Google.');

      const sessionId = createClientSessionId(parsed.accessToken);
      await Promise.all([
        mobileStorage.setItem(TOKEN_KEY, parsed.accessToken),
        mobileStorage.setItem(AUTH_TYPE_KEY, 'supabase'),
        mobileStorage.setItem(SESSION_ID_KEY, sessionId),
      ]);
      const profile = await fetchProfile(parsed.accessToken, true);
      return { success: true, user: profile };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể đăng nhập Google.';
      setAuthError(message);
      return { success: false, message };
    }
  }, [fetchProfile]);

  const register = useCallback<AuthContextValue['register']>(async (username, password, email, role = 'student', teacherCode = '', grade = null) => {
    try {
      const data = await api.post<{ token?: string; message?: string }>('/auth/register', { username, password, email, role, teacherCode, grade });
      if (data.token) {
        await persistCustomSession(data.token);
        await fetchProfile(data.token, true);
      }
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Không thể đăng ký.' };
    }
  }, [fetchProfile, persistCustomSession]);

  const registerTeacher = useCallback<AuthContextValue['registerTeacher']>(async (username, password, email, proofImageUrl) => {
    try {
      const data = await api.post<{ message?: string }>('/auth/register-teacher', { username, password, email, proofImageUrl });
      return { success: true, message: data.message || 'Đã gửi yêu cầu đăng ký giáo viên.' };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Không thể đăng ký giáo viên.' };
    }
  }, []);

  const updateUser = useCallback<AuthContextValue['updateUser']>(async (data) => {
    if (!token) return { success: false, message: 'Vui lòng đăng nhập.' };
    try {
      const updated = await api.patch<AurumUser>('/user/profile', data, { token });
      setUser((prev) => ({ ...prev, ...updated }) as AurumUser);
      return { success: true, user: updated };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Không thể cập nhật hồ sơ.' };
    }
  }, [token]);

  const completeLessonSegment = useCallback<AuthContextValue['completeLessonSegment']>(async (lessonId, level, stars) => {
    if (!token) return { success: false, message: 'Vui lòng đăng nhập.' };
    try {
      const data = await api.post<{ user?: AurumUser; message?: string }>('/user/lesson-segment', { lessonId, level, stars }, { token });
      if (data.user) setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Không thể lưu tiến độ.' };
    }
  }, [token]);

  const completePlacementTest = useCallback<AuthContextValue['completePlacementTest']>(async (grade) => {
    if (!token) return { success: false, message: 'Vui lòng đăng nhập.' };
    try {
      const data = await api.post<{ user?: AurumUser; xpGained?: number; message?: string }>('/user/placement-pass', { grade }, { token });
      if (data.user) setUser(data.user);
      return { success: true, user: data.user, xpGained: data.xpGained };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Không thể lưu bài kiểm tra.' };
    }
  }, [token]);

  const recoverStreak = useCallback<AuthContextValue['recoverStreak']>(async (streakToRestore) => {
    if (!token) return { success: false, message: 'Vui lòng đăng nhập.' };
    try {
      const data = await api.post<{ streakCount?: number; xp?: number; message?: string }>('/user/streak/recover', { streakToRestore }, { token });
      setUser((prev) => prev ? { ...prev, streakCount: data.streakCount, xp: data.xp } : prev);
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Không thể khôi phục chuỗi.' };
    }
  }, [token]);

  const resetStreak = useCallback<AuthContextValue['resetStreak']>(async () => {
    if (!token) return { success: false, message: 'Vui lòng đăng nhập.' };
    try {
      const data = await api.post<{ streakCount?: number; message?: string }>('/user/streak/reset', {}, { token });
      setUser((prev) => prev ? { ...prev, streakCount: data.streakCount } : prev);
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Không thể đặt lại chuỗi.' };
    }
  }, [token]);

  useEffect(() => {
    mountedRef.current = true;
    getStoredSession()
      .then(async (stored) => {
        if (stored.token) await fetchProfile(stored.token, true);
      })
      .catch(async (err) => {
        await clearSession();
        setAuthError(err instanceof Error ? err.message : 'Không thể khởi tạo phiên.');
      })
      .finally(() => mountedRef.current && setLoading(false));

    return () => {
      mountedRef.current = false;
    };
  }, [fetchProfile]);

  useEffect(() => {
    if (!token || !user) return;
    const sendHeartbeat = async () => {
      try {
        const sessionId = await mobileStorage.getItem(SESSION_ID_KEY);
        const data = await api.post<{ success?: boolean; onlineMinutes?: number; streakCount?: number }>('/user/heartbeat', {}, { token, sessionId });
        if (data.success) {
          setUser((prev) => prev ? { ...prev, todayOnlineMinutes: data.onlineMinutes, streakCount: data.streakCount } : prev);
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes('đăng nhập ở một thiết bị khác')) {
          Alert.alert('Phiên đã hết hạn', 'Tài khoản đã đăng nhập ở thiết bị khác.');
          await logout();
        }
      }
    };
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 60000);
    return () => clearInterval(interval);
  }, [logout, token, user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isLoggedIn: !!token && !!user,
    loading,
    authError,
    setAuthError,
    login,
    loginWithGoogle,
    magicLogin,
    register,
    registerTeacher,
    logout,
    refreshUser,
    updateUser,
    completeLessonSegment,
    completePlacementTest,
    recoverStreak,
    resetStreak,
  }), [authError, completeLessonSegment, completePlacementTest, loading, login, loginWithGoogle, logout, magicLogin, recoverStreak, refreshUser, register, registerTeacher, resetStreak, token, updateUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
};
