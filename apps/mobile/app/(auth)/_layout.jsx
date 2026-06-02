import React from "react";
import { Redirect, Stack } from "expo-router";
import { LoadingState } from "../../components/ui/Primitives";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <LoadingState />;
  if (isLoggedIn) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

