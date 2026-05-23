import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GLView } from 'expo-gl';
import { balanceEquation, balancingExercises, molecules } from '@aurum/shared/data';
import { AppScreen } from '@/components/AppScreen';
import { Card, EmptyState, SectionTitle, Tag, TextField } from '@/components/Primitives';
import { EntityList } from '@/components/EntityList';
import { useApiResource } from '@/lib/useApiResource';
import { colors, font, radius, spacing } from '@/theme';

type LabTab = 'simulator' | 'balancer' | 'molecules' | 'solver' | 'discovery';

const tabs: { key: LabTab; label: string }[] = [
  { key: 'simulator', label: '3D Lab' },
  { key: 'balancer', label: 'Cân bằng' },
  { key: 'molecules', label: 'Phân tử' },
  { key: 'solver', label: 'Solver' },
  { key: 'discovery', label: 'Khám phá' },
];

const parseEquation = (equation: string) => {
  const normalized = equation.replace(/=/g, '->').replace(/→/g, '->');
  const [left, right] = normalized.split('->');
  return {
    reactants: (left || '').split('+').map((item) => item.trim()).filter(Boolean),
    products: (right || '').split('+').map((item) => item.trim()).filter(Boolean),
  };
};

export const LabScreen = () => {
  const [tab, setTab] = useState<LabTab>('simulator');
  const [equation, setEquation] = useState('H2 + O2 -> H2O');
  const [query, setQuery] = useState('NaCl');
  const { data: chemicals } = useApiResource<Record<string, unknown>[]>('/lab/chemicals');
  const { data: reactions } = useApiResource<Record<string, unknown>[]>('/lab/reactions');
  const { data: solverResult } = useApiResource<Record<string, unknown>[]>(query ? `/lab/balancing/search?q=${encodeURIComponent(query)}` : null);

  const balanced = useMemo(() => {
    const parsed = parseEquation(equation);
    if (!parsed.reactants.length || !parsed.products.length) return null;
    return balanceEquation(parsed.reactants, parsed.products, 12);
  }, [equation]);

  return (
    <AppScreen title="Phòng lab" subtitle="Simulator, balancing, molecule viewer, solver và discovery map bằng native Expo." dark={tab === 'simulator'}>
      <View style={styles.tabRow}>
        {tabs.map((item) => (
          <Pressable key={item.key} onPress={() => setTab(item.key)} style={[styles.tab, tab === item.key && styles.tabActive]}>
            <Text style={[styles.tabText, tab === item.key && styles.tabTextActive]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'simulator' ? (
        <>
          <Card tone="dark">
            <Tag tone="blue">Expo GL</Tag>
            <Text style={styles.darkTitle}>Magic Lab 3D native</Text>
            <Text style={styles.darkBody}>Renderer này dùng GLView để thay thế canvas DOM. Các phản ứng và hóa chất lấy từ API lab giống web.</Text>
            <GLView
              style={styles.gl}
              onContextCreate={(gl) => {
                gl.clearColor(0.04, 0.05, 0.07, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.flush();
                gl.endFrameEXP();
              }}
            />
          </Card>
          <SectionTitle title="Hóa chất" subtitle="Nguồn dữ liệu /api/lab/chemicals." />
          <EntityList items={(chemicals || []).slice(0, 8)} titleKeys={['name', 'formula', 'id']} subtitleKeys={['description', 'state', 'type']} emptyTitle="Chưa tải hóa chất" />
        </>
      ) : null}

      {tab === 'balancer' ? (
        <>
          <Card>
            <TextField label="Phương trình" value={equation} onChangeText={setEquation} placeholder="H2 + O2 -> H2O" />
            <Tag tone={balanced?.balanced ? 'green' : 'yellow'}>{balanced?.balanced ? 'Đã cân bằng' : 'Chưa cân bằng'}</Tag>
            <Text style={styles.result}>{balanced?.equation || 'Nhập phương trình gồm chất phản ứng và sản phẩm.'}</Text>
          </Card>
          <SectionTitle title="Bài luyện tập" />
          <EntityList items={balancingExercises as unknown as Record<string, unknown>[]} titleKeys={['id']} subtitleKeys={['hint', 'difficulty']} tagKey="difficulty" />
        </>
      ) : null}

      {tab === 'molecules' ? (
        <>
          <SectionTitle title="Molecule viewer" subtitle="Danh sách phân tử local được chuyển sang shared package." />
          <EntityList items={molecules as unknown as Record<string, unknown>[]} titleKeys={['name', 'formula']} subtitleKeys={['description', 'formula']} tagKey="formula" />
        </>
      ) : null}

      {tab === 'solver' ? (
        <>
          <Card>
            <TextField label="Tìm phản ứng/cân bằng" value={query} onChangeText={setQuery} placeholder="NaCl, H2O, Fe2O3..." />
          </Card>
          <EntityList items={solverResult || []} titleKeys={['equation', 'name', 'id']} subtitleKeys={['description', 'hint', 'difficulty']} emptyTitle="Không có kết quả solver" />
        </>
      ) : null}

      {tab === 'discovery' ? (
        <>
          <SectionTitle title="Discovery map" subtitle="Các node khám phá lấy từ reactions API." />
          {reactions?.length ? <EntityList items={reactions.slice(0, 20)} titleKeys={['name', 'equation', 'id']} subtitleKeys={['description', 'type', 'result']} /> : <EmptyState title="Chưa tải reaction map" />}
        </>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tab: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  tabText: {
    color: colors.muted,
    fontWeight: font.heavy,
    fontSize: 12,
  },
  tabTextActive: {
    color: '#fff',
  },
  darkTitle: {
    color: '#fff',
    fontSize: 21,
    fontWeight: font.heavy,
  },
  darkBody: {
    color: 'rgba(255,255,255,0.68)',
    lineHeight: 21,
    fontWeight: font.medium,
  },
  gl: {
    height: 220,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  result: {
    color: colors.text,
    fontSize: 18,
    fontWeight: font.heavy,
  },
});
