/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

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
  const fetchingTokenRef = useRef(null);
  const mountedRef = useRef(true);

  // 2. Define non-dependent functions first
  const logout = useCallback(async () => {
    try {
      const authType = localStorage.getItem('authType');
      if (authType === 'supabase') {
        const supabase = await getSupabase();
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('authType');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
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
      localStorage.removeItem('userId');
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
        localStorage.setItem('userId', userData.id);
        if (mountedRef.current) {
          setUser(userData);
          setIsLoggedIn(true);
        }
        return userData;
      } else if (res.status === 401) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Lá»—i 401 tá»« Server:', errorData);
        if (errorData.message?.includes('Ä‘Äƒng nháº­p á»Ÿ má»™t thiáº¿t bá»‹ khÃ¡c') || errorData.error === 'DUAL_LOGIN') {
          alert('TÃ i khoáº£n cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng nháº­p á»Ÿ má»™t thiáº¿t bá»‹ khÃ¡c. Báº¡n sáº½ bá»‹ Ä‘Äƒng xuáº¥t Ä‘á»ƒ báº£o máº­t.');
          await logout();
        } else {
          alert(`Lá»—i xÃ¡c thá»±c: ${errorData.message || 'KhÃ´ng rÃµ'}. Vui lÃ²ng kiá»ƒm tra Server Vercel.`);
          await logout();
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Lá»—i táº£i profile:', err);
        if (err.message.includes('DUAL_LOGIN')) {
          setAuthError('TÃ i khoáº£n Ä‘Ã£ Ä‘Äƒng nháº­p á»Ÿ nÆ¡i khÃ¡c.');
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
      if (!res.ok) throw new Error(data.message || 'Lá»—i gá»­i yÃªu cáº§u Ä‘Äƒng kÃ½');
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

      if (!res.ok) throw new Error(data?.message || 'Lá»—i Ä‘Äƒng nháº­p');
      
      const newSessionId = createClientSessionId(data.token);
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

      if (!res.ok) throw new Error(data?.message || 'Lá»—i Ä‘Äƒng nháº­p');
      
      const newSessionId = createClientSessionId(data.token);
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
      const supabase = await getSupabase();
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



  const register = useCallback(async (username, password, email, role = 'student', teacherCode = '', grade = null) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, role, teacherCode, grade })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lá»—i Ä‘Äƒng kÃ½');

      const newSessionId = createClientSessionId(data.token);
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      await fetchProfile(data.token, true);
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
        throw new Error(errData.message || 'Lá»—i cáº­p nháº­t profile');
      }
    } catch (err) {
      console.error('Lá»—i cáº­p nháº­t profile:', err);
      return { success: false, message: err.message };
    }
  }, [isLoggedIn, user]);

  const linkAccount = useCallback(async (provider, accountId, providerEmail) => {
    if (!isLoggedIn || !user) return { success: false, message: 'Vui lÃ²ng Ä‘Äƒng nháº­p' };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/link-account', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ provider, accountId, providerEmail })
      });
      const data = await res.json();
      if (res.ok) {
        if (mountedRef.current) {
          setUser(prev => ({ ...prev, linkedAccounts: data.linkedAccounts }));
        }
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Lá»—i liÃªn káº¿t tÃ i khoáº£n');
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [isLoggedIn, user]);

  const completeLessonSegment = useCallback(async (lessonId, level, stars) => {
     if (!isLoggedIn || !user) return { success: false, message: 'Vui lÃ²ng Ä‘Äƒng nháº­p' };
     
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
        if (!res.ok) throw new Error(data.message || 'KhÃ´ng thá»ƒ lÆ°u tiáº¿n Ä‘á»™ bÃ i há»c');
        if (mountedRef.current && data.user) setUser(data.user);
        return { success: true, user: data.user };
     } catch (err) {
        console.error('Lá»—i lÆ°u Ä‘oáº¡n bÃ i há»c:', err);
        return { success: false, message: err.message };
     }
  }, [isLoggedIn, user]);

  const completePlacementTest = useCallback(async (grade) => {
    if (!isLoggedIn || !user) return { success: false, message: 'Vui lÃ²ng Ä‘Äƒng nháº­p' };

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
      if (!res.ok) throw new Error(data.message || 'KhÃ´ng thá»ƒ lÆ°u káº¿t quáº£ test');
      if (mountedRef.current && data.user) setUser(data.user);
      return { success: true, user: data.user, xpGained: data.xpGained };
    } catch (err) {
      console.error('Lá»—i lÆ°u káº¿t quáº£ test:', err);
      return { success: false, message: err.message };
    }
  }, [isLoggedIn, user]);

  const recoverStreak = useCallback(async (streakToRestore) => {
    if (!isLoggedIn || !user) return { success: false, message: 'Vui lÃ²ng Ä‘Äƒng nháº­p' };
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
        throw new Error(data.message || 'Lá»—i khÃ´i phá»¥c chuá»—i');
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [isLoggedIn, user]);

  const resetStreak = useCallback(async () => {
    if (!isLoggedIn || !user) return { success: false, message: 'Vui lÃ²ng Ä‘Äƒng nháº­p' };
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
        throw new Error(data.message || 'Lá»—i thiáº¿t láº­p láº¡i chuá»—i');
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
          await fetchProfile(token, true);
        } else if (authType === 'supabase') {
          // Legacy Supabase login - try to get session
          const supabase = await getSupabase();
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


          }
        } else if (res.status === 401) {
          const errorData = await res.json().catch(() => ({}));
          if (errorData.message?.includes('Ä‘Äƒng nháº­p á»Ÿ má»™t thiáº¿t bá»‹ khÃ¡c') || errorData.error === 'DUAL_LOGIN') {
            alert('PhiÃªn Ä‘Äƒng nháº­p háº¿t háº¡n vÃ¬ báº¡n Ä‘Ã£ Ä‘Äƒng nháº­p á»Ÿ thiáº¿t bá»‹ khÃ¡c.');
          } else {
            // Silent logout for expired token
            console.warn('PhiÃªn Ä‘Äƒng nháº­p khÃ´ng há»£p lá»‡ hoáº·c Ä‘Ã£ háº¿t háº¡n.');
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
    register,
    registerTeacher,
    logout,
    updateProgress,
    refreshUser,
    updateUser,
    linkAccount,
    completeLessonSegment,
    completePlacementTest,
    recoverStreak,
    resetStreak,
    authError,
    setAuthError
  }), [user, isLoggedIn, loading, login, magicLogin, loginWithGoogle, register, registerTeacher, logout, updateProgress, refreshUser, updateUser, linkAccount, completeLessonSegment, completePlacementTest, recoverStreak, resetStreak, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

