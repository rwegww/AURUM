import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import {
  Card,
  EmptyState,
  ErrorState,
  ListRow,
  LoadingState,
  Pill,
  Screen,
  ScreenHeader,
  SectionTitle,
  TextField
} from "../../components/ui/Primitives";
import { colors, radius, spacing } from "../../constants/theme";
import { libraryApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";

export default function LibraryTab() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [knownCategories, setKnownCategories] = React.useState([]);

  const hoc_lieuResource = useApiResource(
    () => libraryApi.list({ category, search }),
    [category, search]
  );

  React.useEffect(() => {
    const nextCategories = Array.from(
      new Set((hoc_lieuResource.data || []).map((item) => item.category).filter(Boolean))
    );
    if (nextCategories.length > 0 && category === "") {
      setKnownCategories(nextCategories.slice(0, 12));
    }
  }, [category, hoc_lieuResource.data]);

  const hoc_lieu = hoc_lieuResource.data || [];

  return (
    <Screen>
      <ScreenHeader
        eyebrow="ThÆ° viá»‡n"
        title="ThÆ° viá»‡n há»c liá»‡u"
        subtitle="TÃ i liá»‡u, Ä‘á»“ há»a thÃ´ng tin, sÆ¡ Ä‘á»“ tÆ° duy vÃ  há»c liá»‡u giÃ¡o viÃªn Ä‘Ã£ Ä‘Äƒng."
        right={<Pill label={`${hoc_lieu.length} má»¥c`} icon="documents-outline" color={colors.green} />}
      />

      <TextField
        icon="search-outline"
        placeholder="TÃ¬m tÃ i liá»‡u"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.categoryRow}>
        <Pressable
          onPress={() => setCategory("")}
          style={[styles.categoryChip, category === "" ? styles.categoryActive : null]}
        >
          <Text style={[styles.categoryText, category === "" ? styles.categoryTextActive : null]}>Táº¥t cáº£</Text>
        </Pressable>
        {knownCategories.map((item) => (
          <Pressable
            key={item}
            onPress={() => setCategory(item)}
            style={[styles.categoryChip, category === item ? styles.categoryActive : null]}
          >
            <Text style={[styles.categoryText, category === item ? styles.categoryTextActive : null]} numberOfLines={1}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle title="Há»c liá»‡u" actionLabel="Táº£i láº¡i" onAction={hoc_lieuResource.reload} />

      {hoc_lieuResource.loading && !hoc_lieuResource.data ? (
        <LoadingState label="Äang táº£i thÆ° viá»‡n..." />
      ) : hoc_lieuResource.error ? (
        <ErrorState message={hoc_lieuResource.error.message} onRetry={hoc_lieuResource.reload} />
      ) : hoc_lieu.length === 0 ? (
        <EmptyState icon="folder-open-outline" title="KhÃ´ng tÃ¬m tháº¥y tÃ i liá»‡u" subtitle="Thá»­ Ä‘á»•i tá»« khÃ³a hoáº·c bá» lá»c danh má»¥c." />
      ) : (
        <View style={styles.stack}>
          {hoc_lieu.map((item) => (
            <ListRow
              key={item.id}
              icon={item.file_type === "pdf" ? "document-text-outline" : "image-outline"}
              title={item.title}
              subtitle={`${item.category || "Há»c liá»‡u"} Â· ${item.view_count || 0} lÆ°á»£t xem`}
              color={colors.green}
              onPress={() => router.push({ pathname: "/library/[id]", params: { id: item.id } })}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  categoryRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  categoryChip: {
    maxWidth: "100%",
    minHeight: 38,
    borderRadius: radius.md,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  categoryActive: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  categoryText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "900"
  },
  categoryTextActive: {
    color: "#ffffff"
  },
  stack: {
    gap: spacing.sm
  }
});


