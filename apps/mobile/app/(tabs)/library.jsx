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
        eyebrow="Thư viện"
        title="Thư viện học liệu"
        subtitle="Tài liệu, đồ họa thông tin, sơ đồ tư duy và học liệu giáo viên đã đăng."
        right={<Pill label={`${hoc_lieu.length} mục`} icon="documents-outline" color={colors.green} />}
      />

      <TextField
        icon="search-outline"
        placeholder="Tìm tài liệu"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.categoryRow}>
        <Pressable
          onPress={() => setCategory("")}
          style={[styles.categoryChip, category === "" ? styles.categoryActive : null]}
        >
          <Text style={[styles.categoryText, category === "" ? styles.categoryTextActive : null]}>Tất cả</Text>
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

      <SectionTitle title="Học liệu" actionLabel="Tải lại" onAction={hoc_lieuResource.reload} />

      {hoc_lieuResource.loading && !hoc_lieuResource.data ? (
        <LoadingState label="Đang tải thư viện..." />
      ) : hoc_lieuResource.error ? (
        <ErrorState message={hoc_lieuResource.error.message} onRetry={hoc_lieuResource.reload} />
      ) : hoc_lieu.length === 0 ? (
        <EmptyState icon="folder-open-outline" title="Không tìm thấy tài liệu" subtitle="Thử đổi từ khóa hoặc bỏ lọc danh mục." />
      ) : (
        <View style={styles.stack}>
          {hoc_lieu.map((item) => (
            <ListRow
              key={item.id}
              icon={item.file_type === "pdf" ? "document-text-outline" : "image-outline"}
              title={item.title}
              subtitle={`${item.category || "Học liệu"} · ${item.view_count || 0} lượt xem`}
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


