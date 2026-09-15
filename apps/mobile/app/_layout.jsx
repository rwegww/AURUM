import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";
import { colors } from "../constants/theme";
import { useFonts } from 'expo-font';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { Nunito_900Black } from '@expo-google-fonts/nunito/900Black';
import { Quicksand_700Bold } from '@expo-google-fonts/quicksand/700Bold';
import { LoadingState } from '../components/ui/Primitives';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Nunito_400Regular, Nunito_600SemiBold, Nunito_800ExtraBold, Nunito_900Black, Quicksand_700Bold });
  if (!fontsLoaded && !fontError) return <LoadingState label="Đang chuẩn bị giao diện..." />;
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

