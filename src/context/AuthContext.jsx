/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  clearGoogleOAuthPending,
  prepareGoogleOAuth,
  waitForSupabaseSession,
} from '@/utils/googleOAuth';

// 1. Define Context and Hook first to ensure they are available to all components immediately
const AuthContext = createContext();

const getSupabase = async () => {
  const { supabase } = await import('@/lib/supabase');
  return supabase;
};

const createClientSessionId = (token) => {
  try {
    const payload = token?.split('.')[1];
    if (payload) {
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=')));
      if (decoded?.sessionId) return decoded.sessionId;
    }
  } catch (err) {
    console.warn('Could not decode JWT session id:', err);
  }

  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const fetchingProfileRef = useRef({ token: null, promise: null });
  const mountedRef = useRef(true);

  // 2. Define non-dependent functions first
  const logout = useCallback(async ({ redirectTo = '/' } = {}) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
      }
      const supabase = await getSupabase();
      await supabase.auth.signOut({ scope: 'local' });
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('authType');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      clearGoogleOAuthPending();
      if (mountedRef.current) {
        setUser(null);
        setIsLoggedIn(false);
      }
      
      if (window.location.pathname !== redirectTo) {
        window.location.href = redirectTo;
      } else {
        window.location.reload();
      }
    }
  }, []);

  // 3. Define functions that depend on others
  const fetchProfile = useCallback((token) => {
    if (!token) {
      localStorage.removeItem('userId');
      if (mountedRef.current) {
        setUser(prev => (prev !== null ? null : prev));
        setIsLoggedIn(prev => (prev !== false ? false : prev));
      }
      setLoading(false);
      return Promise.resolve();
    }

    if (fetchingProfileRef.current.token === token && fetchingProfileRef.current.promise) {
      return fetchingProfileRef.current.promise;
    }

    const request = (async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const url = '/api/user/profile';
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Session-ID': sessionId
          }
        });

        if (res.ok) {
          const userData = await res.json();
          localStorage.setItem('userId', userData.id);
          if (mountedRef.current) {
            setUser(userData);
            setIsLoggedIn(true);
          }
          return userData;
        } else {
          const errorData = await res.json().catch(() => ({}));
          const isAuthenticationFailure = res.status === 401
            || (res.status === 403 && ['ACCOUNT_LOCKED', 'PRIVILEGED_ACCOUNT_LINK_REQUIRED', 'ACCOUNT_LINK_REQUIRED', 'EMAIL_NOT_VERIFIED'].includes(errorData.error));

          if (isAuthenticationFailure) {
            const message = errorData.message || 'Phiên đăng nhập không còn hợp lệ.';
            if (mountedRef.current) setAuthError(message);
            alert(message);
            await logout();
          } else {
            throw new Error(errorData.message || `Không thể tải hồ sơ (HTTP ${res.status}).`);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Lỗi tải profile:', err);
          if (err.message.includes('DUAL_LOGIN')) {
            setAuthError('Tài khoản đã đăng nhập ở nơi khác.');
          } else {
            setAuthError(err.message);
          }
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    fetchingProfileRef.current = { token, promise: request };
    void request.finally(() => {
      if (fetchingProfileRef.current.promise === request) {
        fetchingProfileRef.current = { token: null, promise: null };
      }
    });
    return request;
  }, [logout]);

  const registerTeacher = useCallback(async (username, password, email, proofImageUrl) => {
    try {
      const res = await fetch('/api/auth/register-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, proofImageUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi gửi yêu cầu đăng ký');
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const magicLogin = useCallback(async (tokenParam) => {
    try {
      const res = await fetch('/api/auth/magic-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenParam })
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error(`Server status: ${res.status}`);
      }

      if (!res.ok) throw new Error(data?.message || 'Lỗi đăng nhập');
      
      const newSessionId = createClientSessionId(data.token);
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      const userData = await fetchProfile(data.token);
      if (!userData) throw new Error('Không thể xác nhận hồ sơ sau khi đăng nhập.');
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchProfile]);

  const login = useCallback(async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error(`Server status: ${res.status}`);
      }

      if (!res.ok) throw new Error(data?.message || 'Lỗi đăng nhập');
      
      const newSessionId = createClientSessionId(data.token);
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      const userData = await fetchProfile(data.token);
      if (!userData) throw new Error('Không thể xác nhận hồ sơ sau khi đăng nhập.');
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchProfile]);

  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setAuthError(null);

      const supabase = await getSupabase();
      // Remove any old Supabase session before starting a new OAuth hand-off.
      // Otherwise getSession() on the callback page can briefly return that stale session.
      await supabase.auth.signOut({ scope: 'local' }).catch(() => null);
      prepareGoogleOAuth();
      if (mountedRef.current) {
        setUser(null);
        setIsLoggedIn(false);
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`, // Redirect back to callback to handle session initialization
          queryParams: {
            prompt: 'select_account' // Force Google to show account selection screen
          }
        }
      });
      
      if (error) throw error;
      // Wait for redirect
      return { success: true, redirecting: true };
    } catch (err) {
      console.error('Google login error:', err.message);
      clearGoogleOAuthPending();
      localStorage.removeItem('token');
      localStorage.removeItem('authType');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      if (mountedRef.current) {
        setLoading(false);
        setAuthError(err.message);
      }
      return { success: false, message: err.message };
    }
  }, []);

  const completeGoogleLogin = useCallback(async () => {
    try {
      setLoading(true);
      setAuthError(null);

      const supabase = await getSupabase();
      const session = await waitForSupabaseSession(supabase);
      localStorage.setItem('authType', 'supabase');
      localStorage.setItem('token', session.access_token);
      localStorage.removeItem('sessionId');

      const userData = await fetchProfile(session.access_token);
      if (!userData) {
        throw new Error('Không thể xác nhận hồ sơ sau khi đăng nhập Google.');
      }

      clearGoogleOAuthPending();
      return { success: true, user: userData };
    } catch (err) {
      console.error('Google callback error:', err.message);
      clearGoogleOAuthPending();
      localStorage.removeItem('token');
      localStorage.removeItem('authType');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      if (mountedRef.current) {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
        setAuthError(null);
      }
      return { success: false, message: err.message };
    }
  }, [fetchProfile]);



  const register = useCallback(async (username, password, email, role = 'student', teacherCode = '', grade = null) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, role, teacherCode, grade })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi đăng ký');

      const newSessionId = createClientSessionId(data.token);
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      const userData = await fetchProfile(data.token);
      if (!userData) throw new Error('Không thể xác nhận hồ sơ sau khi đăng ký.');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchProfile]);

  const updateProgress = useCallback(async () => {
    console.warn('updateProgress is deprecated. Use completeLessonSegment or completePlacementTest.');
    return { success: false, message: 'Deprecated progress endpoint' };
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) await fetchProfile(token);
  }, [fetchProfile]);

  const updateUser = useCallback(async (updateData) => {
    if (!isLoggedIn || !user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        const data = await res.json();
        if (mountedRef.current) setUser(prev => ({ ...prev, ...data }));
        return { success: true, user: data };
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Lỗi cập nhật profile');
      }
    } catch (err) {
      console.error('Lỗi cập nhật profile:', err);
      return { success: false, message: err.message };
    }
  }, [isLoggedIn, user]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không thể đổi mật khẩu.');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  const linkAccount = useCallback(async (provider, accountId, providerEmail) => {
    if (!isLoggedIn || !user) return { success: false, message: 'Vui lòng đăng nhập' };
    try {
      const token = localStorage.getItem('token');
      const supabase = await getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Vui lòng đăng nhập Google để xác minh liên kết.');
      const res = await fetch('/api/user/link-account', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ provider, accountId, providerEmail, providerAccessToken: session.access_token })
      });
      const data = await res.json();
      if (res.ok) {
        if (mountedRef.current) {
          setUser(prev => ({ ...prev, ...(data.user || {}), linkedAccounts: data.linkedAccounts }));
        }
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Lỗi liên kết tài khoản');
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [isLoggedIn, user]);

  const completeLessonSegment = useCallback(async (lessonId, level, stars) => {
     if (!isLoggedIn || !user) return { success: false, message: 'Vui lòng đăng nhập' };
     
     try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/user/lesson-segment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ lessonId, level, stars })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lưu tiến độ bài học');
        if (mountedRef.current && data.user) setUser(data.user);
        return { success: true, user: data.user };
     } catch (err) {
        console.error('Lỗi lưu đoạn bài học:', err);
        return { success: false, message: err.message };
     }
  }, [isLoggedIn, user]);

  const completePlacementTest = useCallback(async (grade) => {
    if (!isLoggedIn || !user) return { success: false, message: 'Vui lòng đăng nhập' };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/placement-pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ grade })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không thể lưu kết quả test');
      if (mountedRef.current && data.user) setUser(data.user);
      return { success: true, user: data.user, xpGained: data.xpGained };
    } catch (err) {
      console.error('Lỗi lưu kết quả test:', err);
      return { success: false, message: err.message };
    }
  }, [isLoggedIn, user]);

  const recoverStreak = useCallback(async (streakToRestore) => {
    if (!isLoggedIn || !user) return { success: false, message: 'Vui lòng đăng nhập' };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/streak/recover', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ streakToRestore })
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        if (mountedRef.current) setUser(prev => ({ ...prev, streakCount: data.streakCount, xp: data.xp }));
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Lỗi khôi phục chuỗi');
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [isLoggedIn, user]);

  const resetStreak = useCallback(async () => {
    if (!isLoggedIn || !user) return { success: false, message: 'Vui lòng đăng nhập' };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/streak/reset', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        if (mountedRef.current) setUser(prev => ({ ...prev, streakCount: data.streakCount }));
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Lỗi thiết lập lại chuỗi');
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [isLoggedIn, user]);

  // 4. Initialization Effect
  useEffect(() => {
    mountedRef.current = true;
    const initAuth = async () => {
      try {
        const authType = localStorage.getItem('authType');
        const token = localStorage.getItem('token');
        
        if (authType === 'custom' && token) {
          // Custom login uses the API-issued JWT.
          await fetchProfile(token);
        } else if (authType === 'supabase') {
          // Legacy Supabase login - try to get session
          const supabase = await getSupabase();
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            localStorage.setItem('token', session.access_token);
            await fetchProfile(session.access_token);
          } else if (mountedRef.current) setLoading(false);
        } else {
          if (mountedRef.current) setLoading(false);
        }
      } catch (err) {
        console.error('Init auth error:', err);
        if (mountedRef.current) {
          setLoading(false);
          setAuthError(err.message);
        }
      }
    };

    initAuth();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchProfile]);

  // Keep the token used by Express in sync with Supabase refreshes.
  useEffect(() => {
    let active = true;
    let subscription;
    let pending;
    getSupabase().then((supabase) => {
      if (!active) return;
      subscription = supabase.auth.onAuthStateChange((event, session) => {
        if (localStorage.getItem('authType') !== 'supabase') return;
        if (session?.access_token) {
          localStorage.setItem('token', session.access_token);
          clearTimeout(pending);
          // Run outside the Supabase callback lock.
          pending = setTimeout(() => { if (active) void fetchProfile(session.access_token); }, 0);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('token');
          localStorage.removeItem('authType');
          localStorage.removeItem('sessionId');
          localStorage.removeItem('userId');
          setUser(null); setIsLoggedIn(false); setLoading(false);
        }
      }).data.subscription;
    }).catch(() => {});
    return () => { active = false; clearTimeout(pending); subscription?.unsubscribe(); };
  }, [fetchProfile]);

  // 6. Heartbeat (Activity Tracking)
  useEffect(() => {
    if (!isLoggedIn) return;

    const sendHeartbeat = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const sessionId = localStorage.getItem('sessionId');
        const res = await fetch('/api/user/heartbeat', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Session-ID': sessionId
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (mountedRef.current && data.success) {
            setUser(prev => ({
              ...prev,
              todayOnlineMinutes: data.onlineMinutes,
              streakCount: data.streakCount
            }));


          }
        } else if (res.status === 401 || res.status === 403) {
          const errorData = await res.json().catch(() => ({}));
          if (errorData.message?.includes('đăng nhập ở một thiết bị khác') || errorData.error === 'DUAL_LOGIN') {
            alert('Phiên đăng nhập hết hạn vì bạn đã đăng nhập ở thiết bị khác.');
          } else if (errorData.error === 'ACCOUNT_LOCKED') {
            alert(errorData.message || 'Tài khoản của bạn đã bị khóa.');
          } else if (res.status === 403) {
            return;
          } else {
            // Silent logout for expired token
            console.warn('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
          }
          await logout();
        }
      } catch (err) {
        // Silent error for heartbeat
      }
    };

    // Initial heartbeat
    sendHeartbeat();

    const interval = setInterval(sendHeartbeat, 60000); // Every 1 minute
    return () => clearInterval(interval);
  }, [isLoggedIn, logout, user?.studyPlan]);

  // 5. Memoize Value
  const value = useMemo(() => ({
    user,
    isLoggedIn,
    loading,
    login,
    magicLogin,
    loginWithGoogle,
    completeGoogleLogin,
    register,
    registerTeacher,
    logout,
    updateProgress,
    refreshUser,
    updateUser,
    linkAccount,
    changePassword,
    completeLessonSegment,
    completePlacementTest,
    recoverStreak,
    resetStreak,
    authError,
    setAuthError
  }), [user, isLoggedIn, loading, login, magicLogin, loginWithGoogle, completeGoogleLogin, register, registerTeacher, logout, updateProgress, refreshUser, updateUser, linkAccount, changePassword, completeLessonSegment, completePlacementTest, recoverStreak, resetStreak, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
