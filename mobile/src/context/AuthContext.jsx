import React from 'react';
import { apiRequest } from '../lib/api';
import { getStoredItem, removeStoredItem, setStoredItem } from '../lib/storage';

const TOKEN_KEY = 'aurum_mobile_token';
const AuthContext = React.createContext(null);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

export function AuthProvider({ children }) {
  const [token, setToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [authError, setAuthError] = React.useState(null);
  const hasSession = Boolean(token && user);

  const clearSession = React.useCallback(async () => {
    await removeStoredItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const fetchProfile = React.useCallback(async (authToken, options = {}) => {
    const profile = await apiRequest(
      options.claim ? '/api/user/profile?claim=true' : '/api/user/profile',
      { token: authToken }
    );
    setUser(profile);
    return profile;
  }, []);

  React.useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const storedToken = await getStoredItem(TOKEN_KEY);
        if (!active) return;
        if (storedToken) {
          setToken(storedToken);
          await fetchProfile(storedToken, { claim: true });
        }
      } catch (error) {
        if (active) {
          setAuthError(error.message);
          await clearSession();
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, [clearSession, fetchProfile]);

  React.useEffect(() => {
    if (!hasSession) return undefined;

    const sendHeartbeat = async () => {
      try {
        const data = await apiRequest('/api/user/heartbeat', {
          method: 'POST',
          token,
        });
        if (data?.user) setUser(data.user);
      } catch (error) {
        if (error.status === 401) await clearSession();
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 60000);
    return () => clearInterval(interval);
  }, [clearSession, hasSession, token]);

  const login = React.useCallback(async (username, password) => {
    setAuthError(null);
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    await setStoredItem(TOKEN_KEY, data.token);
    setToken(data.token);
    const profile = await fetchProfile(data.token, { claim: true });
    return profile || data.user;
  }, [fetchProfile]);

  const register = React.useCallback(async ({ username, password, email, grade }) => {
    setAuthError(null);
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { username, password, email, role: 'student', grade: grade || null },
    });
    await setStoredItem(TOKEN_KEY, data.token);
    setToken(data.token);
    const profile = await fetchProfile(data.token, { claim: true });
    return profile || data.user;
  }, [fetchProfile]);

  const logout = React.useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  const refreshProfile = React.useCallback(async () => {
    if (!token) return null;
    return fetchProfile(token);
  }, [fetchProfile, token]);

  const value = React.useMemo(() => ({
    authError,
    isLoggedIn: hasSession,
    loading,
    login,
    logout,
    refreshProfile,
    register,
    setAuthError,
    token,
    user,
  }), [authError, hasSession, loading, login, logout, refreshProfile, register, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
