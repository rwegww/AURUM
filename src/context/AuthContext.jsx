import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchingTokenRef = React.useRef(null);

  const fetchProfile = async (token, force = false) => {
    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    // Prevent redundant fetches for the same token — unless forced (e.g. after unlock)
    if (!force && fetchingTokenRef.current === token) return;
    fetchingTokenRef.current = token;

    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setIsLoggedIn(true);
        return userData;
      } else if (res.status === 401) {
        // Silent logout on 401 (stale/invalid token)
        await logout();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Lỗi tải profile:', err);
      }
    } finally {
      // Always reset so the next call is never blocked
      fetchingTokenRef.current = null;
      setLoading(false);
    }
  };

  useEffect(() => {
    // Rely on onAuthStateChange for initial session as well
    // but check for manual 'custom' tokens for compatibility
    const initAuth = async () => {
      try {
        const authType = localStorage.getItem('authType');
        if (authType === 'custom') {
          const token = localStorage.getItem('token');
          if (token) {
            await fetchProfile(token);
          } else {
            setLoading(false);
          }
        } else {
          // Check for existing Supabase session manually on start
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            localStorage.setItem('token', session.access_token);
            localStorage.setItem('authType', 'supabase');
            await fetchProfile(session.access_token);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Auth Init Error:', err);
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' && session) {
          localStorage.setItem('token', session.access_token);
          localStorage.setItem('authType', 'supabase');
          await fetchProfile(session.access_token);
        } else if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
          localStorage.removeItem('token');
          localStorage.removeItem('authType');
          setUser(null);
          setIsLoggedIn(false);
          
          // If we were on a page other than home, redirect to home to stop all activities
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }
      } catch (authErr) {
        console.error('Lỗi Auth State Change:', authErr);
        // If we get a persistent refresh error, clear everything
        if (authErr.message?.includes('refresh_token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('authType');
          setUser(null);
          setIsLoggedIn(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (username, password) => {
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
        throw new Error(`Server trả về phản hồi không hợp lệ (Status: ${res.status})`);
      }

      if (!res.ok) throw new Error(data?.message || 'Lỗi đăng nhập');

      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      const userData = await fetchProfile(data.token);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
      
      if (error) throw error;
      
      // The actual profile sync happens after redirect in the callback or onAuthStateChange
      return { success: true };
    } catch (err) {
      console.error('Google login error:', err.message);
      setLoading(false);
      return { success: false, message: err.message };
    }
  };

  const register = async (username, password, email, role = 'student') => {
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
  };

  const logout = async () => {
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
      setUser(null);
      setIsLoggedIn(false);
      
      // Force return to home page and full reload to clear all React state/activities
      window.location.href = '/';
    }
  };

  const updateProgress = async (xpGain, unlockedLessonId) => {
    if (!isLoggedIn || !user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ xpGain, unlockedLessonId })
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Lỗi cập nhật tiến độ:', err);
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // force = true: bypass deduplication guard so post-unlock syncs always work
      await fetchProfile(token, true);
    }
  };

  const updateUser = async (updateData) => {
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
        setUser(prev => ({ ...prev, ...data }));
        return { success: true };
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Lỗi cập nhật profile');
      }
    } catch (err) {
      console.error('Lỗi cập nhật profile:', err);
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, loginWithGoogle, register, logout, updateProgress, refreshUser, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
