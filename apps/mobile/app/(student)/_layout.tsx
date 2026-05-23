import React from 'react';
import { Stack } from 'expo-router';
import { RoleGate } from '@/components/RoleGate';

export default function StudentLayout() {
  return (
    <RoleGate allow={['student', 'teacher', 'admin']}>
      <Stack screenOptions={{ headerShown: false }} />
    </RoleGate>
  );
}
