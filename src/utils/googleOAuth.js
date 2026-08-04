export const GOOGLE_OAUTH_PENDING_KEY = 'aurum-google-oauth-pending';

const getBrowserStorage = (name, providedStorage) => {
  if (providedStorage) return providedStorage;
  return typeof window !== 'undefined' ? window[name] : null;
};

export const prepareGoogleOAuth = ({ local, session } = {}) => {
  const localStore = getBrowserStorage('localStorage', local);
  const sessionStore = getBrowserStorage('sessionStorage', session);

  localStore?.removeItem('token');
  localStore?.removeItem('sessionId');
  localStore?.removeItem('userId');
  localStore?.setItem('authType', 'supabase');
  sessionStore?.setItem(GOOGLE_OAUTH_PENDING_KEY, String(Date.now()));
};

export const clearGoogleOAuthPending = (providedStorage) => {
  getBrowserStorage('sessionStorage', providedStorage)?.removeItem(GOOGLE_OAUTH_PENDING_KEY);
};

export const waitForSupabaseSession = async (supabase, { timeoutMs = 10000 } = {}) => {
  if (!supabase?.auth?.getSession || !supabase.auth.onAuthStateChange) {
    throw new Error('Dịch vụ đăng nhập Google chưa sẵn sàng.');
  }

  let unsubscribe = () => {};
  let timerId;

  const sessionPromise = new Promise((resolve, reject) => {
    let settled = false;
    const finish = (error, session) => {
      if (settled) return;
      settled = true;
      clearTimeout(timerId);
      if (error) reject(error);
      else resolve(session);
    };

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.access_token) finish(null, session);
      });
      unsubscribe = () => data?.subscription?.unsubscribe();
    } catch (error) {
      finish(error);
      return;
    }

    if (!settled) {
      timerId = setTimeout(() => {
        finish(new Error('Không nhận được phiên đăng nhập Google. Vui lòng thử lại.'));
      }, timeoutMs);

      Promise.resolve(supabase.auth.getSession()).then(
        ({ data, error }) => {
          if (error) finish(error);
          else if (data?.session?.access_token) finish(null, data.session);
        },
        (error) => finish(error),
      );
    }
  });

  try {
    return await sessionPromise;
  } finally {
    clearTimeout(timerId);
    unsubscribe();
  }
};
