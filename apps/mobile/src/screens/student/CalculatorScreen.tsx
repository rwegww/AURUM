import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CHEM_FORMULAS, UNIT_CONVERSIONS } from '@aurum/shared/data';
import { AppScreen } from '@/components/AppScreen';
import { Card, PrimaryButton, SectionTitle, Tag, TextField } from '@/components/Primitives';
import { colors, font, spacing } from '@/theme';

type Formula = {
  id: string;
  name: string;
  formula: string;
  variables: { key: string; label: string; unit?: string }[];
  solve: (vars: Record<string, number | null>) => Record<string, number> | null;
};

const formulas = Object.values(CHEM_FORMULAS as Record<string, any>).flatMap((group) =>
  group.categories.flatMap((category: any) => category.formulas)
) as Formula[];

export const CalculatorScreen = () => {
  const [formula, setFormula] = useState<Formula>(formulas[0]);
  const [values, setValues] = useState<Record<string, string>>({});
  const result = useMemo(() => {
    const vars = Object.fromEntries(formula.variables.map((variable) => [variable.key, values[variable.key] ? Number(values[variable.key]) : null]));
    return formula.solve(vars);
  }, [formula, values]);

  return (
    <AppScreen title="Máy tính hóa học" subtitle="Công thức và đổi đơn vị từ web được chia sẻ qua packages/shared.">
      <SectionTitle title="Chọn công thức" />
      <View style={styles.formulaList}>
        {formulas.slice(0, 12).map((item) => (
          <Text key={item.id} style={[styles.formulaChip, item.id === formula.id && styles.formulaChipActive]} onPress={() => { setFormula(item); setValues({}); }}>
            {item.name}
          </Text>
        ))}
      </View>
      <Card>
        <Tag tone="blue">{formula.formula}</Tag>
        <Text style={styles.title}>{formula.name}</Text>
        {formula.variables.map((variable) => (
          <TextField
            key={variable.key}
            label={`${variable.label}${variable.unit ? ` (${variable.unit})` : ''}`}
            value={values[variable.key] || ''}
            onChangeText={(text) => setValues((prev) => ({ ...prev, [variable.key]: text.replace(',', '.') }))}
            keyboardType="decimal-pad"
            placeholder="Để trống biến cần tính"
          />
        ))}
        <PrimaryButton title="Tính" />
        <Text style={styles.result}>{result ? Object.entries(result).map(([key, value]) => `${key} = ${Number(value).toLocaleString('vi-VN')}`).join(' • ') : 'Nhập đủ dữ liệu để tính biến còn thiếu.'}</Text>
      </Card>
      <SectionTitle title="Đổi đơn vị nhanh" />
      {(UNIT_CONVERSIONS as any[]).slice(0, 8).map((item, index) => (
        <Card key={index}>
          <Text style={styles.title}>{item.name || item.label}</Text>
          <Text style={styles.result}>{item.formula || item.description || 'Công cụ đổi đơn vị từ dữ liệu web.'}</Text>
        </Card>
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  formulaList: {
    gap: spacing.sm,
  },
  formulaChip: {
    color: colors.muted,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.sm,
    fontWeight: font.heavy,
  },
  formulaChipActive: {
    backgroundColor: colors.green,
    color: '#fff',
    borderColor: colors.green,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: font.heavy,
  },
  result: {
    color: colors.muted,
    lineHeight: 20,
    fontWeight: font.medium,
  },
});
