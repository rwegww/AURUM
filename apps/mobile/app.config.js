module.exports = {
  expo: {
    name: "AURUM",
    slug: "aurum-mobile",
    scheme: "aurum",
    version: "0.1.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    android: {
      package: "vn.aurumchemistry.app"
    },
    ios: {
      bundleIdentifier: "vn.aurumchemistry.app"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-secure-store",
      [
        "expo-web-browser",
        {
          experimentalLauncherActivity: false
        }
      ]
    ],
    experiments: {
      typedRoutes: false
    },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabasePublishableKey:
        process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      ...(process.env.EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL
        ? { googleOAuthRedirectTo: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL }
        : {})
    }
  }
};
