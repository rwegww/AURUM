import React from 'react';
import { Stack } from 'expo-router';
import { RoleGate } from '@/components/RoleGate';

export default function TeacherLayout() {
  return (
    <RoleGate allow={['teacher', 'admin']}>
      <Stack screenOptions={{ headerShown: false }} />
    </RoleGate>
  );
}
