import React from 'react';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Khong tim thay man hinh</Text>
      <Text style={styles.copy}>Duong dan nay chua co trong AURUM Mobile.</Text>
      <Link href="/" style={styles.link}>Ve trang dau</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 24,
    backgroundColor: colors.surface,
  },
  copy: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
  },
  title: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },
  link: {
    color: colors.violet,
    fontSize: 15,
    fontWeight: '900',
  },
});
