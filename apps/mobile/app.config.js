module.exports = {
  expo: {
    name: "AURUM",
    slug: "aurum-mobile",
    scheme: "aurum",
    version: "0.1.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    plugins: ["expo-router", "expo-secure-store"],
    experiments: {
      typedRoutes: false
    },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:5000"
    }
  }
};
