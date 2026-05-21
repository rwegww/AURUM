import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';

const tabIcon = (label) => ({ color }) => (
  <Text style={[styles.icon, { color }]}>{label}</Text>
);

export default function TabsLayout() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.green} size="large" />
      </View>
    );
  }

  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.greenDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Home', tabBarIcon: tabIcon('H') }}
      />
      <Tabs.Screen
        name="classroom"
        options={{ title: 'Classroom', tabBarIcon: tabIcon('C') }}
      />
      <Tabs.Screen
        name="missions"
        options={{ title: 'Missions', tabBarIcon: tabIcon('M') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: tabIcon('P') }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 16,
    fontWeight: '900',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  tabBar: {
    minHeight: 64,
    borderTopColor: colors.border,
    backgroundColor: '#ffffff',
    paddingBottom: 8,
    paddingTop: 8,
  },
});

