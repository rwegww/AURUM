import "react-native-url-polyfill/auto";
import { AppState } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { createClient, processLock } from "@supabase/supabase-js";
import { sessionStore } from "./session";

WebBrowser.maybeCompleteAuthSession();

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};

const supabaseUrl =
  extra.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;

const supabasePublishableKey =
  extra.supabasePublishableKey ||
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const normalizedSupabaseUrl = typeof supabaseUrl === "string" ? supabaseUrl.trim() : "";
const normalizedSupabaseKey = typeof supabasePublishableKey === "string" ? supabasePublishableKey.trim() : "";

const getSupabaseStorageKey = () => {
  try {
    return `sb-${new URL(normalizedSupabaseUrl).hostname.split(".")[0]}-auth-token`;
  } catch {
    return null;
  }
};

const supabaseStorageKey = getSupabaseStorageKey();

const getSupabaseConfigError = () => {
  if (!normalizedSupabaseUrl || !normalizedSupabaseKey) {
    return "Chưa cấu hình đăng nhập Google. Hãy đặt EXPO_PUBLIC_SUPABASE_URL và EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";
  }

  try {
    new URL(normalizedSupabaseUrl);
    return null;
  } catch {
    return "Đường dẫn Supabase chưa hợp lệ. Hãy kiểm tra lại EXPO_PUBLIC_SUPABASE_URL.";
  }
};

export const supabaseConfigError = getSupabaseConfigError();

const supabaseStorage = {
  getItem: (key) => sessionStore.get(key),
  setItem: (key, value) => sessionStore.set(key, value),
  removeItem: (key) => sessionStore.remove(key)
};

export const supabase = supabaseConfigError
  ? null
  : createClient(normalizedSupabaseUrl, normalizedSupabaseKey, {
      auth: {
        storage: supabaseStorage,
        storageKey: supabaseStorageKey,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        lock: processLock
      }
    });

if (supabase && process.env.EXPO_OS !== "web" && AppState?.addEventListener) {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

const parseOAuthParams = (url) => {
  const hash = url.includes("#") ? url.split("#")[1] : "";
  const query = url.includes("?") ? url.split("?")[1].split("#")[0] : "";
  return new URLSearchParams(hash || query);
};

const getGoogleOAuthRedirectTo = () => {
  const configuredRedirect = [
    extra.googleOAuthRedirectTo,
    process.env.EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL
  ].find((value) => typeof value === "string" && value.trim());

  if (configuredRedirect) return configuredRedirect.trim();
  return makeRedirectUri({ scheme: "aurum", path: "auth/callback" });
};

const getAuthUrlRedirectTo = (authUrl) => {
  try {
    return new URL(authUrl).searchParams.get("redirect_to");
  } catch {
    return null;
  }
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error(supabaseConfigError || "Chưa thể khởi tạo đăng nhập Google.");
  }
  return supabase;
};

const getSupabaseHost = () => {
  try {
    return new URL(normalizedSupabaseUrl).host;
  } catch {
    return normalizedSupabaseUrl;
  }
};

export const startGoogleOAuth = async () => {
  const client = requireSupabase();
  const redirectTo = getGoogleOAuthRedirectTo();

  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        prompt: "select_account"
      }
    }
  });

  if (error) throw error;
  if (!data?.url) throw new Error("Không tạo được đường dẫn đăng nhập Google.");

  if (process.env.NODE_ENV !== "production") {
    console.log("[GoogleOAuth]", {
      appOwnership: Constants.appOwnership,
      redirectTo,
      authUrlRedirectTo: getAuthUrlRedirectTo(data.url),
      supabaseHost: getSupabaseHost()
    });
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== "success" || !result.url) {
    throw new Error(
      `Đăng nhập Google chưa quay lại ứng dụng. Hãy thêm Redirect URL này vào Supabase: ${redirectTo}`
    );
  }

  const params = parseOAuthParams(result.url);
  const code = params.get("code");

  if (code) {
    const { data: codeSession, error: codeError } = await client.auth.exchangeCodeForSession(code);
    if (codeError) throw codeError;
    if (!codeSession.session?.access_token) {
      throw new Error("Google không trả về phiên đăng nhập hợp lệ.");
    }
    return codeSession.session;
  }

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) {
    throw new Error("Google không trả về token đăng nhập hợp lệ.");
  }

  const { data: sessionData, error: sessionError } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  if (sessionError) throw sessionError;
  return sessionData.session || { access_token: accessToken, refresh_token: refreshToken };
};

export const getSupabaseAccessToken = async () => {
  const client = requireSupabase();
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  if (data.session?.access_token) return data.session.access_token;

  const refreshed = await client.auth.refreshSession();
  if (refreshed.error) throw refreshed.error;
  return refreshed.data.session?.access_token || null;
};

export const clearSupabaseSession = async () => {
  try {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
  } finally {
    if (supabaseStorageKey) {
      await Promise.all([
        supabaseStorage.removeItem(supabaseStorageKey),
        supabaseStorage.removeItem(`${supabaseStorageKey}-code-verifier`),
        supabaseStorage.removeItem(`${supabaseStorageKey}-user`)
      ]);
    }
  }
};
