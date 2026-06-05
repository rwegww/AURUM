import React from "react";
import { authApi, ApiError } from "../services/api";
import { createSessionId, sessionKeys, sessionStore } from "../services/session";
import {
  clearSupabaseSession,
  getSupabaseAccessToken,
  startGoogleOAuth,
  supabase
} from "../services/supabase";

const AuthContext = React.createContext(null);

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const normalizeLoginIdentifier = (value = "") => {
  const trimmed = String(value).trim();
  return trimmed.includes("@") ? trimmed.toLowerCase() : trimmed;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const persistSession = async ({ token, sessionId, user, authType = "custom" }) => {
  await sessionStore.set(sessionKeys.token, token);
  await sessionStore.set(sessionKeys.sessionId, sessionId);
  await sessionStore.set(sessionKeys.authType, authType);
  if (user?.id) {
    await sessionStore.set(sessionKeys.userId, user.id);
  }
};

const clearSession = async () => {
  await Promise.all([
    sessionStore.remove(sessionKeys.token),
    sessionStore.remove(sessionKeys.sessionId),
    sessionStore.remove(sessionKeys.userId),
    sessionStore.remove(sessionKeys.authType)
  ]);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [sessionId, setSessionId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [authError, setAuthError] = React.useState(null);
  const mountedRef = React.useRef(true);

  const isLoggedIn = Boolean(token && user);

  const logout = React.useCallback(async () => {
    await Promise.all([
      clearSession(),
      clearSupabaseSession().catch(() => null)
    ]);
    if (!mountedRef.current) return;
    setUser(null);
    setToken(null);
    setSessionId(null);
    setAuthError(null);
  }, []);

  const refreshProfile = React.useCallback(async (nextToken = token, nextSessionId = sessionId) => {
    if (!nextToken) return null;
    try {
      const profile = await authApi.profile(nextToken, nextSessionId);
      if (!mountedRef.current) return profile;
      setUser(profile);
      setAuthError(null);
      return profile;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await logout();
      }
      if (mountedRef.current) setAuthError(error.message);
      throw error;
    }
  }, [logout, sessionId, token]);

  const finishAuth = React.useCallback(async (result, authType = "custom") => {
    const nextToken = result.token;
    const nextSessionId = createSessionId();
    const profile = await authApi.profile(nextToken, nextSessionId);
    await persistSession({ token: nextToken, sessionId: nextSessionId, user: profile, authType });
    if (!mountedRef.current) return profile;
    setToken(nextToken);
    setSessionId(nextSessionId);
    setUser(profile);
    setAuthError(null);
    return profile;
  }, []);

  const login = React.useCallback(async (username, password) => {
    try {
      const result = await authApi.login(normalizeLoginIdentifier(username), password);
      await finishAuth(result);
      return { success: true };
    } catch (error) {
      const message = error.message || "Không thể đăng nhập";
      if (mountedRef.current) setAuthError(message);
      return { success: false, message };
    }
  }, [finishAuth]);

  const loginWithGoogle = React.useCallback(async () => {
    try {
      const session = await startGoogleOAuth();
      if (!session?.access_token) {
        throw new Error("Google không trả về phiên đăng nhập hợp lệ");
      }
      await finishAuth({ token: session.access_token }, "supabase");
      return { success: true };
    } catch (error) {
      const message = error.message || "Không thể đăng nhập bằng Google";
      if (mountedRef.current) setAuthError(message);
      return { success: false, message };
    }
  }, [finishAuth]);

  const requestEmailOtp = React.useCallback(async (email) => {
    try {
      const result = await authApi.requestEmailOtp(normalizeEmail(email));
      if (mountedRef.current) setAuthError(null);
      return { success: true, ...result };
    } catch (error) {
      const message = error.message || "Không thể gửi mã OTP";
      if (mountedRef.current) setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const verifyEmailOtp = React.useCallback(async (email, otp) => {
    try {
      const result = await authApi.verifyEmailOtp(normalizeEmail(email), otp.trim());
      await finishAuth(result);
      return { success: true };
    } catch (error) {
      const message = error.message || "Không thể xác thực mã OTP";
      if (mountedRef.current) setAuthError(message);
      return { success: false, message };
    }
  }, [finishAuth]);

  const register = React.useCallback(async ({ username, password, email, grade }) => {
    try {
      const result = await authApi.register({
        username: username.trim(),
        password,
        email: normalizeEmail(email),
        grade
      });
      await finishAuth(result);
      return { success: true };
    } catch (error) {
      const message = error.message || "Không thể đăng ký";
      if (mountedRef.current) setAuthError(message);
      return { success: false, message };
    }
  }, [finishAuth]);

  const updateProfile = React.useCallback(async (patch) => {
    if (!token) return { success: false, message: "Chưa đăng nhập" };
    try {
      const updated = await authApi.updateProfile(token, patch);
      if (mountedRef.current) setUser(updated);
      return { success: true, user: updated };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, [token]);

  React.useEffect(() => {
    mountedRef.current = true;
    const bootstrap = async () => {
      try {
        const [savedToken, savedSessionId, savedAuthType] = await Promise.all([
          sessionStore.get(sessionKeys.token),
          sessionStore.get(sessionKeys.sessionId),
          sessionStore.get(sessionKeys.authType)
        ]);

        if (!savedToken) {
          if (mountedRef.current) setLoading(false);
          return;
        }

        let activeToken = savedToken;
        if (savedAuthType === "supabase") {
          activeToken = await getSupabaseAccessToken();
          if (!activeToken) throw new Error("Phiên Google đã hết hạn");
        }

        const nextSessionId = savedSessionId || createSessionId();
        const profile = await authApi.profile(activeToken, nextSessionId);
        await persistSession({
          token: activeToken,
          sessionId: nextSessionId,
          user: profile,
          authType: savedAuthType || "custom"
        });
        if (!mountedRef.current) return;
        setToken(activeToken);
        setSessionId(nextSessionId);
        setUser(profile);
      } catch (error) {
        await Promise.all([
          clearSession(),
          clearSupabaseSession().catch(() => null)
        ]);
        if (mountedRef.current) {
          setAuthError(error.message);
          setUser(null);
          setToken(null);
          setSessionId(null);
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    bootstrap();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (!supabase) return undefined;

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.access_token || !mountedRef.current) return;

      const authType = await sessionStore.get(sessionKeys.authType);
      if (authType !== "supabase") return;

      await sessionStore.set(sessionKeys.token, session.access_token);
      if (mountedRef.current) setToken(session.access_token);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (!token || !user) return undefined;

    let cancelled = false;
    const sendHeartbeat = async () => {
      try {
        const result = await authApi.heartbeat(token, sessionId);
        if (!cancelled && mountedRef.current && result?.success) {
          setUser((previous) => ({
            ...previous,
            todayOnlineMinutes: result.onlineMinutes,
            streakCount: result.streakCount,
            todayLessonCompleted: result.todayLessonCompleted
          }));
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          await logout();
        }
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [logout, sessionId, token, user?.id]);

  const value = React.useMemo(() => ({
    user,
    token,
    sessionId,
    loading,
    isLoggedIn,
    authError,
    setAuthError,
    login,
    loginWithGoogle,
    requestEmailOtp,
    verifyEmailOtp,
    register,
    logout,
    refreshProfile,
    updateProfile
  }), [
    user,
    token,
    sessionId,
    loading,
    isLoggedIn,
    authError,
    login,
    loginWithGoogle,
    requestEmailOtp,
    verifyEmailOtp,
    register,
    logout,
    refreshProfile,
    updateProfile
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
