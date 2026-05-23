import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { auth as firebaseAuth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import i18n from '@/i18n';

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
  const [authError, setAuthError] = useState(null);
  const fetchingTokenRef = useRef(null);
  const mountedRef = useRef(true);

  // 2. Define non-dependent functions first
  const logout = useCallback(async () => {
    try {
      const authType = localStorage.getItem('authType');
      if (authType === 'supabase') {
        await supabase.auth.signOut();
      }
      if (authType === 'firebase') {
        await firebaseSignOut(firebaseAuth);
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('authType');
      localStorage.removeItem('sessionId');
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
      const sessionId = localStorage.getItem('sessionId');
      // Always claim session if force=true (which happens on login/init)
      const url = force ? `/api/user/profile?claim=true` : `/api/user/profile`;
      const res = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Session-ID': sessionId 
        }
      });
      
      if (res.ok) {
        const userData = await res.json();
        if (mountedRef.current) {
          setUser(userData);
          setIsLoggedIn(true);
        }
        return userData;
      } else if (res.status === 401) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Lỗi 401 từ Server:', errorData);
        if (errorData.message?.includes('đăng nhập ở một thiết bị khác') || errorData.error === 'DUAL_LOGIN') {
          alert('Tài khoản của bạn đã được đăng nhập ở một thiết bị khác. Bạn sẽ bị đăng xuất để bảo mật.');
          await logout();
        } else {
          alert(`Lỗi xác thực: ${errorData.message || 'Không rõ'}. Vui lòng kiểm tra Server Vercel.`);
          await logout();
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
      fetchingTokenRef.current = null;
      if (mountedRef.current) setLoading(false);
    }
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
      
      const newSessionId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      const userData = await fetchProfile(data.token, true);
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
      
      const newSessionId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      const userData = await fetchProfile(data.token, true);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchProfile]);

  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      // Store intended auth type
      localStorage.setItem('authType', 'supabase');
      
      // Use Supabase OAuth which uses secure redirect out of the box
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
      if (mountedRef.current) {
        setLoading(false);
        setAuthError(err.message);
      }
      return { success: false, message: err.message };
    }
  }, []);

  const loginWithTelegram = useCallback(async (telegramData) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const res = await fetch('/api/auth/telegram-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramData)
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error(`Server status: ${res.status}`);
      }

      if (!res.ok) throw new Error(data?.message || 'Lỗi đăng nhập Telegram');
      
      const newSessionId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      const userData = await fetchProfile(data.token, true);
      return { success: true, user: userData };
    } catch (err) {
      if (mountedRef.current) {
        setLoading(false);
        setAuthError(err.message);
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

      const newSessionId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      await fetchProfile(data.token, true);
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

  const linkAccount = useCallback(async (provider, accountId) => {
    if (!isLoggedIn || !user) return { success: false, message: 'Vui lòng đăng nhập' };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/link-account', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ provider, accountId })
      });
      const data = await res.json();
      if (res.ok) {
        if (mountedRef.current) {
          setUser(prev => ({ ...prev, linkedAccounts: data.linkedAccounts }));
        }
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Lỗi liên kết tài khoản');
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [isLoggedIn, user]);

  const completeLessonSegment = useCallback(async (lessonId, level, stars, xpGain, isLessonCompletion) => {
     if (!isLoggedIn || !user) return;
     
     try {
        const currentProgress = user.balancingProgress || { lessonStars: {} };
        const lessonStars = { ...(currentProgress.lessonStars || {}) };
        const currentLessonStars = { ...(lessonStars[lessonId] || { level1: 0, level2: 0, level3: 0 }) };
        
        // Update stars
        currentLessonStars[level] = Math.max(currentLessonStars[level], stars);
        lessonStars[lessonId] = currentLessonStars;

        const updateData = {
          balancingProgress: {
            ...currentProgress,
            lessonStars: lessonStars
          }
        };

        // 1. Save profile
        const updateRes = await updateUser(updateData);
        
        // 2. Save XP/Unlock
        await updateProgress(xpGain, isLessonCompletion ? lessonId : null, isLessonCompletion);
        
        return { success: true };
     } catch (err) {
        console.error('Lỗi lưu đoạn bài học:', err);
        return { success: false, message: err.message };
     }
  }, [isLoggedIn, user, updateUser, updateProgress]);

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
        
        if ((authType === 'custom' || authType === 'firebase') && token) {
          // Custom login or Firebase login - token is our own JWT
          await fetchProfile(token, true);
        } else if (authType === 'supabase') {
          // Legacy Supabase login - try to get session
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            localStorage.setItem('token', session.access_token);
            await fetchProfile(session.access_token, true);
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

            // --- Study Plan Reminder Logic ---
            const studyPlan = data.user?.studyPlan || user?.studyPlan;
            if (studyPlan?.remindersEnabled && !data.todayLessonCompleted) {
              const now = new Date();
              const [hours, minutes] = (studyPlan.studyTime || '20:00').split(':').map(Number);
              const studyDateTime = new Date();
              studyDateTime.setHours(hours, minutes, 0, 0);

              if (now >= studyDateTime) {
                const today = now.toISOString().split('T')[0];
                const lastReminder = localStorage.getItem('last_study_reminder');
                
                if (lastReminder !== today) {
                  // Using alert as a simple notification for now
                  // In a real app, use a Toast or Browser Notification API
                  const msg = i18n.language === 'vi' 
                    ? "🔔 Đã đến giờ học rồi! Hãy vào học ngay để hoàn thành mục tiêu hôm nay nhé!"
                    : "🔔 It's study time! Let's complete your daily goal now!";
                  
                  alert(msg);
                  localStorage.setItem('last_study_reminder', today);
                }
              }
            }
            // ---------------------------------
          }
        } else if (res.status === 401) {
          const errorData = await res.json().catch(() => ({}));
          if (errorData.message?.includes('đăng nhập ở một thiết bị khác') || errorData.error === 'DUAL_LOGIN') {
            alert('Phiên đăng nhập hết hạn vì bạn đã đăng nhập ở thiết bị khác.');
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
  }, [isLoggedIn]);

  // 5. Memoize Value
  const value = useMemo(() => ({
    user,
    isLoggedIn,
    loading,
    login,
    magicLogin,
    loginWithGoogle,
    loginWithTelegram,
    register,
    registerTeacher,
    logout,
    updateProgress,
    refreshUser,
    updateUser,
    linkAccount,
    completeLessonSegment,
    recoverStreak,
    resetStreak,
    authError,
    setAuthError
  }), [user, isLoggedIn, loading, login, magicLogin, loginWithGoogle, loginWithTelegram, register, registerTeacher, logout, updateProgress, refreshUser, updateUser, linkAccount, recoverStreak, resetStreak, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
