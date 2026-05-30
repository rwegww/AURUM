import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { elements, enrichElement } from '@aurum/shared/data';
import { AppScreen } from '@/components/AppScreen';
import { Card, SectionTitle, Tag, TextField } from '@/components/Primitives';
import { colors, font, radius } from '@/theme';

export const PeriodicTableScreen = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const list = useMemo(() => {
    const q = query.toLowerCase();
    return (elements as Record<string, unknown>[]).filter((item) =>
      !q ||
      String(item.symbol).toLowerCase().includes(q) ||
      String(item.name).toLowerCase().includes(q) ||
      String(item.number).includes(q)
    );
  }, [query]);
  const detail = selected ? enrichElement(selected) : null;

  return (
    <AppScreen title="Bảng tuần hoàn" subtitle="Dữ liệu element web được dùng chung qua packages/shared.">
      <TextField label="Tìm nguyên tố" value={query} onChangeText={setQuery} placeholder="H, O, Natri..." />
      {detail ? (
        <Card>
          <Tag tone="blue">Z = {String(detail.number)}</Tag>
          <Text style={styles.symbol}>{String(detail.symbol)}</Text>
          <Text style={styles.name}>{String(detail.name)}</Text>
          <Text style={styles.desc}>{String(detail.desc || detail.summary || 'Không có mô tả.')}</Text>
        </Card>
      ) : null}
      <SectionTitle title="Nguyên tố" subtitle={`${list.length} kết quả`} />
      <View style={styles.grid}>
        {list.map((item) => (
          <Pressable key={String(item.number)} onPress={() => setSelected(item)} style={styles.element}>
            <Text style={styles.number}>{String(item.number)}</Text>
            <Text style={styles.elementSymbol}>{String(item.symbol)}</Text>
            <Text style={styles.elementName} numberOfLines={1}>{String(item.name)}</Text>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  symbol: {
    color: colors.green,
    fontSize: 48,
    fontWeight: font.heavy,
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: font.heavy,
  },
  desc: {
    color: colors.muted,
    lineHeight: 21,
    fontWeight: font.medium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  element: {
    width: '15.6%',
    minHeight: 66,
    borderRadius: radius.sm,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 5,
  },
  number: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: font.bold,
  },
  elementSymbol: {
    color: colors.text,
    fontSize: 18,
    fontWeight: font.heavy,
    textAlign: 'center',
  },
  elementName: {
    color: colors.muted,
    fontSize: 8,
    textAlign: 'center',
    fontWeight: font.bold,
  },
});
