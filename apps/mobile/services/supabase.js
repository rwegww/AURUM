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

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing Supabase mobile config. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
  );
}

const supabaseStorage = {
  getItem: (key) => sessionStore.get(key),
  setItem: (key, value) => sessionStore.set(key, value),
  removeItem: (key) => sessionStore.remove(key)
};

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock
  }
});

if (process.env.EXPO_OS !== "web" && AppState?.addEventListener) {
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

export const startGoogleOAuth = async () => {
  const redirectTo = getGoogleOAuthRedirectTo();

  const { data, error } = await supabase.auth.signInWithOAuth({
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
      supabaseHost: new URL(supabaseUrl).host
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
    const { data: codeSession, error: codeError } = await supabase.auth.exchangeCodeForSession(code);
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

  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  if (sessionError) throw sessionError;
  return sessionData.session || { access_token: accessToken, refresh_token: refreshToken };
};

export const getSupabaseAccessToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (data.session?.access_token) return data.session.access_token;

  const refreshed = await supabase.auth.refreshSession();
  if (refreshed.error) throw refreshed.error;
  return refreshed.data.session?.access_token || null;
};

export const clearSupabaseSession = async () => {
  await supabase.auth.signOut();
};
