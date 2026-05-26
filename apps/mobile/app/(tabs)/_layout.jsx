import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LoadingState } from "../../components/ui/Primitives";
import { colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

const tabIcon = (name) => ({ color, size }) => (
  <Ionicons name={name} color={color} size={size} />
);

export default function TabsLayout() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <LoadingState />;
  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: "#98a2b3",
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "900"
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Nhà", tabBarIcon: tabIcon("home-outline") }}
      />
      <Tabs.Screen
        name="journey"
        options={{ title: "Lộ trình", tabBarIcon: tabIcon("map-outline") }}
      />
      <Tabs.Screen
        name="classroom"
        options={{ title: "Lớp học", tabBarIcon: tabIcon("school-outline") }}
      />
      <Tabs.Screen
        name="arena"
        options={{ title: "Đấu trường", tabBarIcon: tabIcon("trophy-outline") }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: "Thêm", tabBarIcon: tabIcon("grid-outline") }}
      />
      <Tabs.Screen
        name="lab"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="library"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile"
        options={{ href: null }}
      />
    </Tabs>
  );
}
