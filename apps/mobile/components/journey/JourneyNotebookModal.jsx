import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { JOURNEY_COVERS } from '../../../../shared/journeyPresentation';
import { getLessonInfographicUrl } from '../../../../shared/lessonAssets';
import LessonSummary from './LessonSummary';
import InfographicImage from './InfographicImage';
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../services/api";
import { colors, spacing, typography } from "../../constants/theme";

const lessonIdOf = (lesson) => lesson?.lessonId || lesson?.id;

const infographicUrlOf = (lesson, grade, order) => {
  const raw = getLessonInfographicUrl(lesson, grade, order);
  return raw?.startsWith('/') ? API_BASE_URL + raw : raw;
};

export default function JourneyNotebookModal({ visible, onClose, lessons, grade, user, theme }) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const cover = JOURNEY_COVERS[grade] || JOURNEY_COVERS["8"];
  const [failedImage, setFailedImage] = React.useState("");

  React.useEffect(() => {
    if (visible) {
      setPageIndex(0);
      setFailedImage("");
    }
  }, [visible, grade]);

  const pages = [{ type: "cover" }, ...(lessons || []).map((lesson) => ({ type: "lesson", lesson })), { type: "back-cover" }];
  const page = pages[pageIndex] || pages[0];
  const lesson = page?.lesson;
  const lessonId = lessonIdOf(lesson);
  const stars = user?.balancingProgress?.lessonStars?.[lessonId] || {};
  const unlocked = ["teacher", "admin"].includes(user?.role)
    || Number(stars.level3 || 0) > 0
    || user?.unlockedLessons?.map(String).includes(String(lessonId));
  const imageUrl = lesson ? infographicUrlOf(lesson, grade, Number(lesson.order) || pageIndex) : "";

  return (
    <Modal visible={visible} animationType="fade" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>Cẩm nang lớp {grade}</Text>
            <Text style={styles.topTitle}>Sổ Tay Hóa Học</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Đóng sổ tay" onPress={onClose} style={styles.closeButton}><Ionicons name="close" size={23} color="#ffffff" /></Pressable>
        </View>

        <ScrollView style={styles.bookArea} contentContainerStyle={styles.bookContent}>
          {page?.type === "cover" || page?.type === "back-cover" ? (
            <LinearGradient colors={cover.colors} style={[styles.cover, { borderColor: cover.accent }]}>
              <View style={styles.coverOrnament} pointerEvents="none" />
              <View style={styles.coverSpine} />
              <View style={[styles.coverGlyph, { backgroundColor: theme.primary }]}><Ionicons name="flask-outline" size={37} color="#ffffff" /></View>
              <Text style={styles.coverBadge}>LỚP {grade}</Text>
              <Text style={styles.coverTitle}>{page.type === "cover" ? cover.title : "AURUM CHEMISTRY"}</Text>
              <Text style={styles.coverSubtitle}>{page.type === "cover" ? cover.subtitle : "Survival Journey Complete"}</Text>
              <Text style={styles.coverHint}>Nhấn mũi tên để lật sách</Text>
            </LinearGradient>
          ) : (
            <View style={styles.page}>
              <View style={styles.pageHeader}>
                <View style={[styles.pageNumber, { backgroundColor: theme.primary }]}><Text style={styles.pageNumberText}>{pageIndex}</Text></View>
                <View style={styles.pageHeaderCopy}><Text style={styles.pageEyebrow}>Tranh kiến thức</Text><Text style={styles.pageTitle} numberOfLines={2}>{lesson?.title}</Text></View>
              </View>
              {!unlocked ? (
                <View style={styles.lockedPage}>
                  <Ionicons name="lock-closed" size={44} color={colors.muted} />
                  <Text style={styles.lockedTitle}>Trang này chưa được mở</Text>
                  <Text style={styles.lockedText}>Hoàn thành đủ 3 vòng của bài học để nhận tranh kiến thức.</Text>
                </View>
              ) : imageUrl && failedImage !== imageUrl ? (
                <InfographicImage key={imageUrl} uri={imageUrl} title={lesson?.title} style={styles.infographic} onError={() => setFailedImage(imageUrl)} />
              ) : (
                <LessonSummary lesson={lesson} />
              )}
            </View>
          )}
        </ScrollView>

        <View style={styles.navigation}>
          <Pressable accessibilityRole="button" disabled={pageIndex === 0} onPress={() => setPageIndex((current) => Math.max(0, current - 1))} style={[styles.navButton, pageIndex === 0 ? styles.disabled : null]}>
            <Ionicons name="arrow-back" size={20} color="#ffffff" /><Text style={styles.navText}>Trang trước</Text>
          </Pressable>
          <Text style={styles.pageCount}>{pageIndex + 1}/{pages.length}</Text>
          <Pressable accessibilityRole="button" disabled={pageIndex === pages.length - 1} onPress={() => { setPageIndex((current) => Math.min(pages.length - 1, current + 1)); setFailedImage(""); }} style={[styles.navButton, pageIndex === pages.length - 1 ? styles.disabled : null]}>
            <Text style={styles.navText}>Trang sau</Text><Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#0f172a", flex: 1, padding: spacing.md },
  topBar: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  eyebrow: { color: "#a7f3d0", fontFamily: typography.bold, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase" },
  topTitle: { color: "#ffffff", fontFamily: typography.bold, fontSize: 24, marginTop: 3 },
  closeButton: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.09)", borderColor: "rgba(255,255,255,0.12)", borderRadius: 13, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  bookArea: { flex: 1 },
  bookContent: { flexGrow: 1, justifyContent: "center", paddingVertical: 18 },
  coverOrnament: { position: "absolute", top: 16, bottom: 16, left: 16, right: 16, borderWidth: 2, borderColor: "rgba(245,158,11,0.3)", borderRadius: 14 },
  cover: { alignItems: "center", alignSelf: "center", borderBottomWidth: 9, borderRadius: 22, borderWidth: 3, gap: 12, justifyContent: "center", minHeight: 440, overflow: "hidden", padding: 28, position: "relative", width: "92%" },
  coverSpine: { backgroundColor: "rgba(2,6,23,0.34)", bottom: 0, left: 0, position: "absolute", top: 0, width: 22 },
  coverGlyph: { alignItems: "center", borderColor: "rgba(255,255,255,0.28)", borderRadius: 22, borderWidth: 2, height: 78, justifyContent: "center", width: 78 },
  coverBadge: { color: "#fde68a", fontFamily: typography.bold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" },
  coverTitle: { color: "#fbbf24", fontWeight: "900", fontStyle: "italic", fontFamily: typography.bold, fontSize: 26, lineHeight: 34, textAlign: "center" },
  coverSubtitle: { color: "rgba(255,255,255,0.72)", fontFamily: typography.medium, fontSize: 14, lineHeight: 21, textAlign: "center" },
  coverHint: { bottom: 20, color: "rgba(255,255,255,0.42)", fontFamily: typography.medium, fontSize: 10, position: "absolute" },
  page: { backgroundColor: "#fcf8f0", borderColor: "#d8ccb7", borderRadius: 20, borderWidth: 2, minHeight: 440, overflow: "hidden", padding: 14 },
  pageHeader: { alignItems: "center", borderBottomColor: "#e7dcc9", borderBottomWidth: 1, flexDirection: "row", gap: 10, paddingBottom: 12 },
  pageNumber: { alignItems: "center", borderRadius: 13, height: 42, justifyContent: "center", width: 42 },
  pageNumberText: { color: "#ffffff", fontFamily: typography.bold, fontSize: 17 },
  pageHeaderCopy: { flex: 1 },
  pageEyebrow: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 9, letterSpacing: 1, textTransform: "uppercase" },
  pageTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 16, lineHeight: 21, marginTop: 2 },
  infographic: { height: 440, marginTop: 12, width: "100%" },
  lockedPage: { alignItems: "center", flex: 1, gap: 10, justifyContent: "center", padding: 20 },
  lockedTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 20, textAlign: "center" },
  lockedText: { color: colors.muted, fontFamily: typography.medium, fontSize: 13, lineHeight: 20, textAlign: "center" },
  navigation: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  navButton: { alignItems: "center", backgroundColor: colors.green, borderRadius: 13, flexDirection: "row", gap: 7, minHeight: 46, paddingHorizontal: 10 },
  navText: { color: "#ffffff", fontFamily: typography.bold, fontSize: 12 },
  pageCount: { color: "rgba(255,255,255,0.58)", fontFamily: typography.bold, fontSize: 12 },
  disabled: { opacity: 0.3 }
});
