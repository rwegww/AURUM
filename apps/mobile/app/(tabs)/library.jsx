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
  PrimaryButton,
  Screen,
  ScreenHeader,
  SectionTitle,
  TextField
} from "../../components/ui/Primitives";
import { colors, radius, spacing } from "../../constants/theme";
import { libraryApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";

const PAGE_SIZE = 24;

export default function LibraryTab() {
  const [search, setSearch] = React.useState("");
  const deferredSearch = React.useDeferredValue(search);
  const [category, setCategory] = React.useState("");
  const [knownCategories, setKnownCategories] = React.useState([]);
  const [extraMaterials, setExtraMaterials] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [loadMoreError, setLoadMoreError] = React.useState("");
  const loadMoreRequestRef = React.useRef(0);

  const hoc_lieuResource = useApiResource(
    () => libraryApi.list({ category, search: deferredSearch, page: 1, limit: PAGE_SIZE }),
    [category, deferredSearch]
  );

  const firstPageMaterials = hoc_lieuResource.data || [];
  const hoc_lieu = React.useMemo(() => [
    ...firstPageMaterials,
    ...extraMaterials.filter((item) => !firstPageMaterials.some((firstItem) => firstItem.id === item.id))
  ], [extraMaterials, firstPageMaterials]);

  const resetPagination = () => {
    loadMoreRequestRef.current += 1;
    setExtraMaterials([]);
    setPage(1);
    setHasMore(false);
    setLoadMoreError("");
  };

  const loadMore = async () => {
    if (loadingMore) return;
    const requestId = loadMoreRequestRef.current + 1;
    loadMoreRequestRef.current = requestId;
    setLoadingMore(true);
    setLoadMoreError("");
    try {
      const nextPage = page + 1;
      const nextItems = await libraryApi.list({
        category,
        search: deferredSearch,
        page: nextPage,
        limit: PAGE_SIZE
      });
      if (loadMoreRequestRef.current !== requestId) return;
      const items = Array.isArray(nextItems) ? nextItems : [];
      setExtraMaterials((current) => [
        ...current,
        ...items.filter((item) => !current.some((existing) => existing.id === item.id))
      ]);
      setPage(nextPage);
      setHasMore(items.length === PAGE_SIZE);
    } catch (error) {
      if (loadMoreRequestRef.current === requestId) setLoadMoreError(error.message);
    } finally {
      if (loadMoreRequestRef.current === requestId) setLoadingMore(false);
    }
  };

  React.useEffect(() => {
    const nextCategories = Array.from(
      new Set(hoc_lieu.map((item) => item.category).filter(Boolean))
    );
    if (nextCategories.length > 0 && category === "") {
      setKnownCategories(nextCategories.slice(0, 12));
    }
  }, [category, hoc_lieu]);

  const searchPending = search !== deferredSearch;
  const canLoadMore = !searchPending && (page === 1 ? firstPageMaterials.length === PAGE_SIZE : hasMore);

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Thư viện"
        title="Thư viện học liệu"
        subtitle="Tài liệu, đồ họa thông tin, sơ đồ tư duy và học liệu giáo viên đã đăng."
        right={<Pill label={`${hoc_lieu.length} mục đã tải`} icon="documents-outline" color={colors.green} />}
      />

      <TextField
        icon="search-outline"
        placeholder="Tìm tài liệu"
        value={search}
        onChangeText={(value) => {
          resetPagination();
          setSearch(value);
        }}
      />

      <View style={styles.categoryRow}>
        <Pressable
          onPress={() => {
            resetPagination();
            setCategory("");
          }}
          style={[styles.categoryChip, category === "" ? styles.categoryActive : null]}
        >
          <Text style={[styles.categoryText, category === "" ? styles.categoryTextActive : null]}>Tất cả</Text>
        </Pressable>
        {knownCategories.map((item) => (
          <Pressable
            key={item}
            onPress={() => {
              resetPagination();
              setCategory(item);
            }}
            style={[styles.categoryChip, category === item ? styles.categoryActive : null]}
          >
            <Text style={[styles.categoryText, category === item ? styles.categoryTextActive : null]} numberOfLines={1}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle
        title="Học liệu"
        actionLabel="Tải lại"
        onAction={() => {
          resetPagination();
          hoc_lieuResource.reload();
        }}
      />

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
          {canLoadMore ? (
            <PrimaryButton
              label={loadingMore ? "Đang tải..." : "Tải thêm học liệu"}
              icon="chevron-down-outline"
              onPress={loadMore}
              disabled={loadingMore}
            />
          ) : null}
          {loadMoreError ? <Text style={styles.loadMoreError}>{loadMoreError}</Text> : null}
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
  },
  loadMoreError: {
    color: colors.red,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center"
  }
});
