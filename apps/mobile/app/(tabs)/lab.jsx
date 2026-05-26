import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  EmptyState,
  GhostButton,
  Pill,
  PrimaryButton,
  Screen,
  ScreenHeader,
  SectionTitle,
  TextField
} from "../../components/ui/Primitives";
import { colors, radius, spacing } from "../../constants/theme";
import { labApi } from "../../services/api";

const formulaGroups = [
  {
    id: "basic",
    title: "Số mol và khối lượng",
    formulas: [
      {
        id: "mol_mass",
        name: "Mol từ khối lượng",
        formula: "n = m / M",
        keywords: "mol khoi luong m M",
        variables: [
          { key: "n", label: "Số mol", unit: "mol" },
          { key: "m", label: "Khối lượng chất", unit: "g" },
          { key: "M", label: "Khối lượng mol", unit: "g/mol" }
        ],
        solve: ({ n, m, M }) => {
          if (m !== null && M !== null) return { n: m / M };
          if (n !== null && M !== null) return { m: n * M };
          if (n !== null && m !== null) return { M: m / n };
          return null;
        }
      },
      {
        id: "mol_volume",
        name: "Mol khí ở điều kiện chuẩn",
        formula: "n = V / 22,4",
        keywords: "mol khi the tich dieu kien chuan",
        variables: [
          { key: "n", label: "Số mol", unit: "mol" },
          { key: "V", label: "Thể tích khí", unit: "L" }
        ],
        solve: ({ n, V }) => {
          if (V !== null) return { n: V / 22.4 };
          if (n !== null) return { V: n * 22.4 };
          return null;
        }
      },
      {
        id: "particles",
        name: "Mol từ số hạt",
        formula: "n = N / NA",
        keywords: "mol so hat avogadro",
        variables: [
          { key: "n", label: "Số mol", unit: "mol" },
          { key: "N", label: "Số hạt", unit: "hạt" }
        ],
        solve: ({ n, N }) => {
          const avogadro = 6.022e23;
          if (N !== null) return { n: N / avogadro };
          if (n !== null) return { N: n * avogadro };
          return null;
        }
      }
    ]
  },
  {
    id: "solution",
    title: "Dung dịch",
    formulas: [
      {
        id: "percent_concentration",
        name: "Nồng độ phần trăm",
        formula: "C% = mct / mdd × 100",
        keywords: "nong do phan tram dung dich chat tan",
        variables: [
          { key: "C", label: "Nồng độ phần trăm", unit: "%" },
          { key: "mct", label: "Khối lượng chất tan", unit: "g" },
          { key: "mdd", label: "Khối lượng dung dịch", unit: "g" }
        ],
        solve: ({ C, mct, mdd }) => {
          if (mct !== null && mdd !== null) return { C: (mct / mdd) * 100 };
          if (C !== null && mdd !== null) return { mct: (C * mdd) / 100 };
          if (C !== null && mct !== null) return { mdd: (mct * 100) / C };
          return null;
        }
      },
      {
        id: "molarity",
        name: "Nồng độ mol",
        formula: "CM = n / V",
        keywords: "nong do mol molarity the tich",
        variables: [
          { key: "CM", label: "Nồng độ mol", unit: "M" },
          { key: "n", label: "Số mol chất tan", unit: "mol" },
          { key: "V", label: "Thể tích dung dịch", unit: "L" }
        ],
        solve: ({ CM, n, V }) => {
          if (n !== null && V !== null) return { CM: n / V };
          if (CM !== null && V !== null) return { n: CM * V };
          if (CM !== null && n !== null) return { V: n / CM };
          return null;
        }
      },
      {
        id: "dilution",
        name: "Pha loãng dung dịch",
        formula: "C1V1 = C2V2",
        keywords: "pha loang dung dich",
        variables: [
          { key: "C1", label: "Nồng độ ban đầu", unit: "M" },
          { key: "V1", label: "Thể tích ban đầu", unit: "mL" },
          { key: "C2", label: "Nồng độ sau pha", unit: "M" },
          { key: "V2", label: "Thể tích sau pha", unit: "mL" }
        ],
        solve: ({ C1, V1, C2, V2 }) => {
          if (C1 !== null && V1 !== null && V2 !== null) return { C2: (C1 * V1) / V2 };
          if (C1 !== null && V1 !== null && C2 !== null) return { V2: (C1 * V1) / C2 };
          if (C2 !== null && V2 !== null && V1 !== null) return { C1: (C2 * V2) / V1 };
          if (C2 !== null && V2 !== null && C1 !== null) return { V1: (C2 * V2) / C1 };
          return null;
        }
      }
    ]
  },
  {
    id: "reaction",
    title: "Phản ứng và pH",
    formulas: [
      {
        id: "yield",
        name: "Hiệu suất phản ứng",
        formula: "H% = thực tế / lý thuyết × 100",
        keywords: "hieu suat phan ung",
        variables: [
          { key: "H", label: "Hiệu suất", unit: "%" },
          { key: "actual", label: "Lượng thực tế", unit: "" },
          { key: "theory", label: "Lượng lý thuyết", unit: "" }
        ],
        solve: ({ H, actual, theory }) => {
          if (actual !== null && theory !== null) return { H: (actual / theory) * 100 };
          if (H !== null && theory !== null) return { actual: (H * theory) / 100 };
          if (H !== null && actual !== null) return { theory: (actual * 100) / H };
          return null;
        }
      },
      {
        id: "ph",
        name: "Tính pH",
        formula: "pH = -log[H+]",
        keywords: "ph acid base H+",
        variables: [
          { key: "pH", label: "pH", unit: "" },
          { key: "H", label: "Nồng độ H+", unit: "mol/L" }
        ],
        solve: ({ pH, H }) => {
          if (H !== null && H > 0) return { pH: -Math.log10(H) };
          if (pH !== null) return { H: Math.pow(10, -pH) };
          return null;
        }
      }
    ]
  }
];

const unitConversions = [
  "1 L = 1000 mL",
  "1 kg = 1000 g",
  "T(K) = t°C + 273",
  "NA = 6,022 × 10^23",
  "R = 0,0821 L.atm/(mol.K)",
  "F = 96500 C/mol"
];

const allFormulas = formulaGroups.flatMap((group) =>
  group.formulas.map((formula) => ({ ...formula, groupTitle: group.title }))
);

const toolConfig = {
  formula: {
    title: "Gợi ý công thức",
    subtitle: "Tra phương trình cân bằng và công thức thường dùng",
    introTitle: "Khu tra cứu",
    introText: "Tìm phương trình đã cân bằng, xem công thức nhanh và đổi đơn vị.",
    icon: "shield-checkmark-outline",
    color: colors.green,
    softBg: "#f2faeb",
    border: "#d8efc7"
  },
  calculator: {
    title: "Máy tính hóa học",
    subtitle: "Nhập dữ kiện và tính biến còn thiếu",
    introTitle: "Khu tính toán",
    introText: "Chọn một công thức, nhập các ô đã biết và để trống đại lượng cần tìm.",
    icon: "calculator-outline",
    color: colors.green,
    softBg: "#eef8ff",
    border: "#cfeaff"
  }
};

const formatNumber = (value) => {
  if (value === undefined || value === null || Number.isNaN(value)) return "-";
  if (Math.abs(value) >= 1e6 || (Math.abs(value) < 0.001 && value !== 0)) {
    return value.toExponential(4);
  }
  return Number(value.toFixed(6)).toString();
};

export default function SupportToolsTab() {
  const [activeTool, setActiveTool] = React.useState("formula");
  const [equationQuery, setEquationQuery] = React.useState("");
  const [equationResults, setEquationResults] = React.useState([]);
  const [equationSearched, setEquationSearched] = React.useState(false);
  const [searching, setSearching] = React.useState(false);
  const [formulaQuery, setFormulaQuery] = React.useState("");
  const [selectedFormula, setSelectedFormula] = React.useState(allFormulas[0]);
  const [inputs, setInputs] = React.useState({});
  const [result, setResult] = React.useState(null);

  const filteredFormulas = React.useMemo(() => {
    const keyword = formulaQuery.trim().toLowerCase();
    if (!keyword) return allFormulas;
    return allFormulas.filter((item) => (
      `${item.name} ${item.formula} ${item.groupTitle} ${item.keywords}`.toLowerCase().includes(keyword)
    ));
  }, [formulaQuery]);

  const searchEquation = async () => {
    if (!equationQuery.trim()) {
      setEquationResults([]);
      setEquationSearched(false);
      return;
    }

    setSearching(true);
    setEquationSearched(true);
    const data = await labApi.searchEquation(equationQuery.trim()).catch(() => []);
    setEquationResults(data || []);
    setSearching(false);
  };

  const chooseFormula = (formula) => {
    setSelectedFormula(formula);
    setInputs({});
    setResult(null);
    setActiveTool("calculator");
  };

  const calculate = () => {
    const vars = {};
    selectedFormula.variables.forEach((variable) => {
      const raw = inputs[variable.key];
      vars[variable.key] = raw === "" || raw === undefined ? null : Number(String(raw).replace(",", "."));
    });

    const filled = Object.values(vars).filter((value) => value !== null && Number.isFinite(value)).length;
    if (filled < selectedFormula.variables.length - 1) {
      setResult({ error: `Nhập ít nhất ${selectedFormula.variables.length - 1} giá trị để hệ thống suy ra ô còn lại.` });
      return;
    }

    const solved = selectedFormula.solve(vars);
    setResult(solved ? { values: solved } : { error: "Tổ hợp dữ liệu này chưa đủ hoặc chưa được công thức hỗ trợ." });
  };

  const clearCalculator = () => {
    setInputs({});
    setResult(null);
  };

  const activeConfig = toolConfig[activeTool];

  const renderToolSwitch = () => (
    <View style={styles.toolSwitch}>
      {Object.entries(toolConfig).map(([key, config]) => {
        const active = activeTool === key;
        return (
          <Pressable
            key={key}
            onPress={() => setActiveTool(key)}
            style={[
              styles.toolTab,
              active ? { backgroundColor: config.color, borderColor: config.color } : null
            ]}
          >
            <Ionicons name={config.icon} size={22} color={active ? "#ffffff" : config.color} />
            <Text style={[styles.toolTabTitle, active ? styles.toolTabTitleActive : null]} numberOfLines={2}>
              {config.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderModeHero = () => (
    <View style={[styles.modeHero, { backgroundColor: activeConfig.softBg, borderColor: activeConfig.border }]}>
      <View style={[styles.modeIcon, { backgroundColor: activeConfig.color }]}>
        <Ionicons name={activeConfig.icon} size={25} color="#ffffff" />
      </View>
      <View style={styles.modeCopy}>
        <Text style={[styles.modeEyebrow, { color: activeConfig.color }]}>{activeConfig.introTitle}</Text>
        <Text style={styles.modeTitle}>{activeConfig.title}</Text>
        <Text style={styles.modeText}>{activeConfig.introText}</Text>
      </View>
    </View>
  );

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Hỗ trợ"
        title="Công cụ hỗ trợ"
        subtitle="Tra công thức, tìm phương trình cân bằng và tính nhanh các bài toán hóa học."
        right={<Pill label="2 công cụ" icon="construct-outline" color={colors.green} />}
      />

      {renderToolSwitch()}
      {renderModeHero()}

      {activeTool === "formula" ? (
        <>
          <Card accent={colors.green} style={styles.searchCard}>
            <Text style={styles.cardTitle}>Gợi ý phương trình cân bằng</Text>
            <Text style={styles.cardSubtitle}>Nhập chất tham gia hoặc sản phẩm để tìm phương trình có sẵn trong hệ thống.</Text>
            <TextField
              icon="search-outline"
              placeholder="Ví dụ: H2 + O2, Fe, KMnO4"
              value={equationQuery}
              onChangeText={setEquationQuery}
              autoCorrect={false}
              onSubmitEditing={searchEquation}
            />
            <GhostButton
              label={searching ? "Đang tìm..." : "Tìm phương trình"}
              icon="search-outline"
              onPress={searchEquation}
              color={colors.green}
            />
          </Card>

          {equationResults.length > 0 ? (
            <>
              <SectionTitle title="Phương trình gợi ý" />
              <View style={styles.stack}>
                {equationResults.map((item, index) => (
                  <Card key={`${item.equation_string}-${index}`} style={styles.resultCard}>
                    <Pill label="Đã cân bằng" icon="checkmark-outline" color={colors.green} />
                    <Text style={styles.equation}>{item.equation_string || "Phương trình"}</Text>
                    <Text style={styles.equationMeta}>
                      Hệ số: {Array.isArray(item.answer) ? item.answer.join(", ") : JSON.stringify(item.answer || {})}
                    </Text>
                  </Card>
                ))}
              </View>
            </>
          ) : equationSearched && !searching ? (
            <EmptyState
              icon="search-outline"
              title="Chưa tìm thấy phương trình"
              subtitle="Thử nhập công thức ngắn hơn, ví dụ Fe, O2 hoặc NaOH."
            />
          ) : null}



        </>
      ) : (
        <>
          <SectionTitle title="Công thức đang tính" />
          <Card accent={colors.green} style={styles.calculatorCard}>
            <View style={styles.calculatorTop}>
              <View style={styles.calculatorTitleBlock}>
                <Text style={styles.cardTitle}>{selectedFormula.name}</Text>
                <Text style={styles.cardSubtitle}>{selectedFormula.groupTitle}</Text>
              </View>
              <Pill label={selectedFormula.formula} icon="calculator-outline" color={colors.green} />
            </View>

            <View style={styles.inputStack}>
              {selectedFormula.variables.map((variable) => {
                const solvedValue = result?.values?.[variable.key];
                const isSolved = solvedValue !== undefined;
                return (
                  <View key={variable.key} style={styles.inputBlock}>
                    <Text style={styles.inputLabel}>
                      {variable.label}{variable.unit ? ` (${variable.unit})` : ""}
                    </Text>
                    <TextField
                      icon={isSolved ? "checkmark-circle-outline" : "create-outline"}
                      placeholder={isSolved ? formatNumber(solvedValue) : `Nhập ${variable.key}`}
                      value={isSolved ? formatNumber(solvedValue) : (inputs[variable.key] || "")}
                      onChangeText={(value) => {
                        setInputs((previous) => ({ ...previous, [variable.key]: value }));
                        if (result) setResult(null);
                      }}
                      keyboardType="decimal-pad"
                      editable={!isSolved}
                    />
                  </View>
                );
              })}
            </View>

            {result?.error ? <Text style={styles.errorText}>{result.error}</Text> : null}

            <View style={styles.actionRow}>
              <PrimaryButton label="Tính kết quả" icon="calculator-outline" color={colors.green} onPress={calculate} style={styles.actionButton} />
              <GhostButton label="Xóa" icon="refresh-outline" onPress={clearCalculator} color={colors.red} style={styles.clearButton} />
            </View>
          </Card>

          {result?.values ? (
            <Card accent={colors.green} style={styles.resultCard}>
              <Text style={styles.cardTitle}>Kết quả</Text>
              {Object.entries(result.values).map(([key, value]) => {
                const variable = selectedFormula.variables.find((item) => item.key === key);
                return (
                  <View key={key} style={styles.resultRow}>
                    <Text style={styles.resultLabel}>{variable?.label || key}</Text>
                    <Text style={styles.resultValue}>
                      {formatNumber(value)}{variable?.unit ? ` ${variable.unit}` : ""}
                    </Text>
                  </View>
                );
              })}
            </Card>
          ) : null}

          <SectionTitle title="Đổi công thức" />
          <View style={styles.stack}>
            {formulaGroups.map((group) => (
              <Card key={group.id} style={styles.groupCard}>
                <Text style={styles.groupTitle}>{group.title}</Text>
                {group.formulas.map((formula) => (
                  <Pressable
                    key={formula.id}
                    onPress={() => chooseFormula(formula)}
                    style={[styles.formulaPicker, selectedFormula.id === formula.id ? styles.formulaPickerActive : null]}
                  >
                    <Text style={[styles.pickerName, selectedFormula.id === formula.id ? styles.pickerNameActive : null]}>{formula.name}</Text>
                    <Text style={[styles.pickerFormula, selectedFormula.id === formula.id ? styles.pickerFormulaActive : null]}>{formula.formula}</Text>
                  </Pressable>
                ))}
              </Card>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  toolSwitch: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 6
  },
  toolTab: {
    flex: 1,
    minHeight: 70,
    borderRadius: radius.md,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: 5
  },
  toolTabTitle: {
    color: colors.ink,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    textAlign: "center"
  },
  toolTabTitleActive: {
    color: "#ffffff"
  },
  modeHero: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center"
  },
  modeIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  modeCopy: {
    flex: 1,
    gap: 3
  },
  modeEyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  modeTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  modeText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  },
  sectionHint: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: -6
  },
  searchCard: {
    gap: spacing.md
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900"
  },
  cardSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600"
  },
  stack: {
    gap: spacing.sm
  },
  resultCard: {
    gap: spacing.sm
  },
  equation: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "900"
  },
  equationMeta: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700"
  },
  formulaCard: {
    gap: spacing.sm
  },
  formulaCopy: {
    gap: 3
  },
  formulaName: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  formulaGroup: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  formulaExpression: {
    color: colors.green,
    fontSize: 18,
    fontWeight: "900"
  },
  formulaBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  calculatorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#eef8ff",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  calculatorBadgeText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900"
  },
  conversionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  conversionChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  conversionText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800"
  },
  calculatorCard: {
    gap: spacing.md
  },
  calculatorTop: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  calculatorTitleBlock: {
    flex: 1,
    gap: 4
  },
  inputStack: {
    gap: spacing.sm
  },
  inputBlock: {
    gap: 6
  },
  inputLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900"
  },
  errorText: {
    color: colors.red,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800"
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  actionButton: {
    flex: 1
  },
  clearButton: {
    width: 96
  },
  resultRow: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4
  },
  resultLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  resultValue: {
    color: colors.green,
    fontSize: 20,
    fontWeight: "900"
  },
  groupCard: {
    gap: spacing.sm
  },
  groupTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  formulaPicker: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4
  },
  formulaPickerActive: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  pickerName: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900"
  },
  pickerNameActive: {
    color: "#ffffff"
  },
  pickerFormula: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "900"
  },
  pickerFormulaActive: {
    color: "#ffffff"
  }
});
