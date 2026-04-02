import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (token) => {
    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        await logout();
      }
    } catch (err) {
      console.error('Lỗi tải profile:', err);
      // Don't logout immediately on network error, but handle token expiry
      if (err.message.includes('401') || err.message.includes('expired')) {
        await logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('authType', 'supabase');
        await fetchProfile(session.access_token);
      } else {
        const token = localStorage.getItem('token');
        if (token) {
          await fetchProfile(token);
        } else {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('authType', 'supabase');
        await fetchProfile(session.access_token);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('token');
        localStorage.removeItem('authType');
        setUser(null);
        setIsLoggedIn(false);
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

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi đăng nhập');

      localStorage.setItem('token', data.token);
      localStorage.setItem('authType', 'custom');
      await fetchProfile(data.token);
      return { success: true };
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
    const authType = localStorage.getItem('authType');
    if (authType === 'supabase') {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('authType');
    setUser(null);
    setIsLoggedIn(false);
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

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, loginWithGoogle, register, logout, updateProgress, loading }}>
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
