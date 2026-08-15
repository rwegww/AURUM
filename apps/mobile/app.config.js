module.exports = {
  expo: {
    name: "AURUM",
    slug: "aurum-mobile",
    owner: "bataraboom",
    scheme: "aurum",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    android: {
      package: "vn.aurumchemistry.app",
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#ffffff"
      }
    },
    ios: {
      bundleIdentifier: "vn.aurumchemistry.app"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-secure-store",
      "expo-status-bar",
      [
        "expo-web-browser",
        {
          experimentalLauncherActivity: false
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true
          }
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
        : {}),
      eas: {
        projectId: "d132183d-6778-4453-9532-3b56904a63d3"
      }
    }
  }
};
