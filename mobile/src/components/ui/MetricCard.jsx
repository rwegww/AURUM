import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, shadow } from '../../theme';

export default function MetricCard({ label, value, tone = colors.green }) {
  return (
    <View style={[styles.card, shadow]}>
      <Text style={[styles.value, { color: tone }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 136,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 16,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.ink,
    fontSize: 25,
    fontWeight: '900',
  },
});

