import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";
import { colors } from "../constants/theme";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="journey/[grade]/index" />
          <Stack.Screen name="journey/[grade]/[lessonId]/index" />
          <Stack.Screen name="library/[id]" />
          <Stack.Screen name="classroom/[id]" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

