import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// 1. Define Context and Hook first to ensure they are available to all components immediately
const AuthContext = createContext();

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
  const fetchingTokenRef = useRef(null);
  const mountedRef = useRef(true);

  // 2. Define non-dependent functions first
  const logout = useCallback(async () => {
    try {
      const authType = localStorage.getItem('authType');
      if (authType === 'supabase') {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('authType');
      if (mountedRef.current) {
        setUser(null);
        setIsLoggedIn(false);
      }
      
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      } else {
        window.location.reload();
      }
    }
  }, []);

  // 3. Define functions that depend on others
  const fetchProfile = useCallback(async (token, force = false) => {
    if (!token) {
      if (mountedRef.current) {
        setUser(prev => (prev !== null ? null : prev));
        setIsLoggedIn(prev => (prev !== false ? false : prev));
      }
      setLoading(false);
      return;
    }

    if (!force && fetchingTokenRef.current === token) {
      setLoading(false);
      return;
    }
    fetchingTokenRef.current = token;

    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const userData = await res.json();
        if (mountedRef.current) {
          setUser(userData);
          setIsLoggedIn(true);
        }
        return userData;
      } else if (res.status === 401) {
        await logout();
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Lỗi tải profile:', err);
    } finally {
      fetchingTokenRef.current = null;
      if (mountedRef.current) setLoading(false);
    }
  }, [logout]);

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

      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      const userData = await fetchProfile(data.token);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchProfile]);

  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Google login error:', err.message);
      if (mountedRef.current) setLoading(false);
      return { success: false, message: err.message };
    }
  }, []);

  const register = useCallback(async (username, password, email, role = 'student') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi đăng ký');

      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      await fetchProfile(data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchProfile]);

  const updateProgress = useCallback(async (xpGain, unlockedLessonId, isLessonCompletion = false) => {
    if (!isLoggedIn || !user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ xpGain, unlockedLessonId, isLessonCompletion })
      });
      if (res.ok) {
        const data = await res.json();
        if (mountedRef.current) {
          setUser(prev => ({ 
            ...prev, 
            xp: data.xp, 
            level: data.level, 
            unlockedLessons: data.unlockedLessons,
            streakCount: data.streakCount ?? prev.streakCount,
            todayLessonCompleted: data.todayLessonCompleted ?? prev.todayLessonCompleted
          }));
        }
      }
    } catch (err) {
      console.error('Lỗi cập nhật tiến độ:', err);
    }
  }, [isLoggedIn, user]);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) await fetchProfile(token, true);
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
        return { success: true };
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Lỗi cập nhật profile');
      }
    } catch (err) {
      console.error('Lỗi cập nhật profile:', err);
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
      if (res.ok) {
        if (mountedRef.current) setUser(prev => ({ ...prev, streakCount: data.streakCount, xp: data.xp }));
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Lỗi khôi phục chuỗi');
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
        if (authType === 'custom') {
          const token = localStorage.getItem('token');
          if (token) await fetchProfile(token);
          else if (mountedRef.current) setLoading(false);
        } else {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            localStorage.setItem('token', session.access_token);
            localStorage.setItem('authType', 'supabase');
            await fetchProfile(session.access_token);
          } else if (mountedRef.current) setLoading(false);
        }
      } catch (err) {
        if (mountedRef.current) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' && session) {
          localStorage.setItem('token', session.access_token);
          localStorage.setItem('authType', 'supabase');
          await fetchProfile(session.access_token);
        } else if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
          localStorage.removeItem('token');
          localStorage.removeItem('authType');
          if (mountedRef.current) {
            setUser(null);
            setIsLoggedIn(false);
          }
          if (window.location.pathname !== '/') window.location.href = '/';
        }
      } catch (authErr) {
        console.error('Auth status change error:', authErr);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // 6. Heartbeat (Activity Tracking)
  useEffect(() => {
    if (!isLoggedIn) return;

    const sendHeartbeat = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/user/heartbeat', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
        }
      } catch (err) {
        // Silent error for heartbeat
      }
    };

    // Initial heartbeat
    sendHeartbeat();

    const interval = setInterval(sendHeartbeat, 60000); // Every 1 minute
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // 5. Memoize Value
  const value = useMemo(() => ({
    user,
    isLoggedIn,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProgress,
    refreshUser,
    updateUser,
    recoverStreak
  }), [user, isLoggedIn, loading, login, loginWithGoogle, register, logout, updateProgress, refreshUser, updateUser, recoverStreak]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
