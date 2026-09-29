import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { EmptyState, ErrorState, LoadingState, Screen } from "../../components/ui/Primitives";
import PlacementAssessmentModal from "../../components/journey/PlacementAssessmentModal";
import JourneyNotebookModal from "../../components/journey/JourneyNotebookModal";
import { spacing, typography } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { learningApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";

import { LinearGradient } from 'expo-linear-gradient';
import JourneyRail from '../../components/journey/JourneyRail';
import { JOURNEY_THEMES as CLASS_THEMES } from '../../../../shared/journeyPresentation';
import { createJourneyLayout } from '../../../../shared/journeyLayout';
import { getJourneyLessonStatuses, lessonIdOf, resolveJourneyGrade } from '../../../../shared/journeyProgress';

const GRADES = ["6", "7", "8", "9", "10", "11", "12"];
const LEVELS = ["level1", "level2", "level3"];
const OPTIONAL_PLACEMENT_GRADES = new Set(["9", "10", "11", "12"]);
const MAP_TILE_URI = "https://res.cloudinary.com/dpcorzgkm/image/upload/aurum/public/assets/images/journey-chemistry-map-bg.png";

const cleanLessonTitle = (lesson, index) => lesson?.title?.split(": ").pop() || `Bài học ${index + 1}`;

const ThemeGlyph = ({ theme, color = "#ffffff", size = 24 }) => theme.icon ? (
  <Ionicons name={theme.icon} size={size} color={color} />
) : (
  <Text style={[styles.themeFormula, { color, fontSize: size * 0.72 }]}>{theme.symbol}</Text>
);

const StageNode = ({ lesson, index, point, onOpen, theme, compact, wide }) => {
  const nodeWidth = compact ? 117.6 : wide ? 168 : 134.4;
  const plaqueColor = lesson.isCompleted ? theme.primary : lesson.isUnlocked ? "#f97316" : "#64748b";
  const plaqueDark = lesson.isCompleted ? theme.primaryDark : lesson.isUnlocked ? "#c2410c" : "#475569";

  return (
    <Pressable
      disabled={!lesson.isUnlocked}
      onPress={() => onOpen(lesson)}
      accessibilityRole="button"
      accessibilityState={{ disabled: !lesson.isUnlocked }}
      accessibilityLabel={`Chặng ${index + 1}: ${cleanLessonTitle(lesson, index)}, ${!lesson.isUnlocked ? "đang khóa" : lesson.isCompleted ? "đã hoàn thành" : "đã mở"}`}
      style={({ pressed }) => [
        styles.stageNode,
        { left: `${point.x}%`, top: point.y * 16 - (compact ? 80.8 : 92.8), width: nodeWidth, marginLeft: -nodeWidth / 2 },
        pressed && lesson.isUnlocked ? styles.stagePressed : null,
        !lesson.isUnlocked ? styles.stageLocked : null
      ]}
    >
      <View style={[styles.stageStack, !compact && { width: 118.4 }]}>
        <LinearGradient colors={[lesson.isCompleted ? "#a3e635" : lesson.isUnlocked ? "#ffb02e" : "#94a3b8", plaqueColor, plaqueDark]} style={[styles.stagePlaque, { borderBottomColor: plaqueDark }, !compact && { width: 89.6, height: 82.4 }]}>
          <Text style={styles.stageKicker}>Chặng</Text>
          <Text style={styles.stageNumber}>{index + 1}</Text>
          {!lesson.isUnlocked || lesson.isCompleted ? <View style={styles.stageStatusBadge}>
            <Ionicons name={lesson.isCompleted ? "trophy" : lesson.isUnlocked ? "play" : "lock-closed"} size={12} color="#7c2d12" />
          </View> : null}
        </LinearGradient>
        <View style={[styles.stagePedestal, !compact && { width: 118.4 }]}>
          <View style={styles.stagePedestalTop} />
        </View>
      </View>
      <View style={[styles.stageCaption, { width: nodeWidth }]}>
        <Text style={styles.stageTitle} numberOfLines={2}>{cleanLessonTitle(lesson, index)}</Text>
        <View style={styles.starRow}>
          {LEVELS.map((level) => (
            <Ionicons key={level} name="star" size={13} color={Number(lesson.stars?.[level] || 0) > 0 ? "#fbbf24" : "#cbd5e1"} />
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default function JourneyMap() {
  const { token, user, refreshProfile, loading: authLoading, isLoggedIn } = useAuth();
  const { grade: routeGrade } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const compact = width <= 580;
  const placement = user?.balancingProgress?.placement;
  const placementManaged = user?.role === "student" && placement?.required === true;
  const isPlaced = placementManaged && placement?.status === "placed" && GRADES.includes(String(placement?.assignedGrade));
  const placedGrade = isPlaced ? String(placement.assignedGrade) : "";
  const availableGrades = isPlaced ? [placedGrade] : GRADES;
  const [selectedGrade, setSelectedGrade] = React.useState(null);
  const grade = resolveJourneyGrade({ routeGrade, selectedGrade, user });
  const setGrade = (value) => {
    if (routeGrade) router.setParams({ grade: value });
    else setSelectedGrade(value);
  };
  const [mapWidth, setMapWidth] = React.useState(340);
  const [assessment, setAssessment] = React.useState(null);
  const [assessmentMode, setAssessmentMode] = React.useState("initial");
  const [notebookOpen, setNotebookOpen] = React.useState(false);
  const [notebook, setNotebook] = React.useState({ grade: null, lessons: [], loading: false, error: "" });
  const notebookRequest = React.useRef(0);
  React.useEffect(() => {
    setNotebookOpen(false);
    setNotebook({ grade: null, lessons: [], loading: false, error: "" });
    return () => { notebookRequest.current += 1; };
  }, [grade]);
  const [startingAssessment, setStartingAssessment] = React.useState(false);
  const theme = CLASS_THEMES[grade] || CLASS_THEMES["8"];



  const lessonResource = useApiResource(
    async () => ({ grade, lessons: await learningApi.bai_hoc({ classId: Number(grade), view: "journey" }) }),
    [grade]
  );
  const lessons = lessonResource.data?.grade === grade ? lessonResource.data.lessons : [];
  const lessonsWithStatus = getJourneyLessonStatuses(lessons, user, grade);

  const completedCount = lessonsWithStatus.filter((lesson) => lesson.isCompleted).length;
  let highestUnlockedIndex = -1;
  lessonsWithStatus.forEach((lesson, index) => {
    if (lesson.isUnlocked) highestUnlockedIndex = index;
  });

  const layout = createJourneyLayout(lessonsWithStatus.length)[width > 900 ? "desktop" : "mobile"];
  const points = layout.points;
  const mapHeight = layout.height * 16;
  const completion = lessonsWithStatus.length ? completedCount / lessonsWithStatus.length : 0;
  const canShowJourney = !placementManaged || isPlaced;
  const canOpenNotebook = Boolean(lessonsWithStatus[0]?.isCompleted || ["teacher", "admin"].includes(user?.role));
  const showOptionalTest = !placementManaged
    && OPTIONAL_PLACEMENT_GRADES.has(grade)
    && lessonsWithStatus.length > 0
    && !user?.balancingProgress?.passedGrades?.map(String).includes(grade)
    && !user?.unlockedLessons?.map(String).includes(String(lessonIdOf(lessonsWithStatus[0])));

  const openNotebook = async () => {
    if (!canOpenNotebook || notebook.loading) return;
    if (notebook.grade === grade) { setNotebookOpen(true); return; }
    const request = ++notebookRequest.current;
    setNotebook({ grade: null, lessons: [], loading: true, error: "" });
    try {
      const data = await learningApi.bai_hoc({ classId: Number(grade), view: "full" });
      if (request !== notebookRequest.current) return;
      setNotebook({ grade, lessons: data, loading: false, error: "" });
      setNotebookOpen(true);
    } catch (error) {
      if (request === notebookRequest.current) setNotebook({ grade: null, lessons: [], loading: false, error: error.message });
    }
  };

  const openLesson = (lesson) => {
    router.push({ pathname: "/journey/[grade]/[lessonId]", params: { grade, lessonId: lessonIdOf(lesson) } });
  };

  const startPlacement = async () => {
    if (startingAssessment) return;
    setStartingAssessment(true);
    try {
      const response = await learningApi.startPlacement(token, grade);
      if (!response?.assessment?.questions?.length) throw new Error('Chưa tải được câu hỏi đánh giá. Vui lòng thử lại.');
      setAssessmentMode("initial");
      setAssessment(response.assessment);
      await refreshProfile();
    } catch (error) {
      Alert.alert("Chưa thể bắt đầu đánh giá", error.message);
    } finally {
      setStartingAssessment(false);
    }
  };

  const startOptionalTest = async () => {
    if (startingAssessment) return;
    setStartingAssessment(true);
    try {
      const response = await learningApi.startOptionalPlacement(token, grade);
      if (!response?.assessment?.questions?.length) throw new Error('Chưa tải được câu hỏi học vượt. Vui lòng thử lại.');
      setAssessmentMode("optional");
      setAssessment(response.assessment);
      await refreshProfile();
    } catch (error) {
      Alert.alert("Chưa thể bắt đầu bài học vượt", error.message);
    } finally {
      setStartingAssessment(false);
    }
  };

  const submitAssessment = async (payload) => {
    if (assessmentMode !== "optional") return learningApi.submitPlacement(token, payload);
    return learningApi.completePlacement(token, payload);
  };

  if (authLoading) return <LoadingState />;
  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <Screen style={styles.page}>
      <LinearGradient pointerEvents="none" colors={['#eefad9', '#f8f5de', '#e8f7d6']} style={StyleSheet.absoluteFill} />
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.replace("/journey")} style={styles.roundControl} accessibilityLabel="Quay lại lớp học">
          <Ionicons name="chevron-back" size={27} color="#ffffff" />
        </Pressable>
        <View style={styles.titleBoard}>
          <View style={[styles.titleTop, compact && { justifyContent: "center" }]}>
            <View style={[styles.titleIcon, compact && { display: "none" }, { backgroundColor: theme.primary, borderBottomColor: theme.primaryDark }]}>
              <ThemeGlyph theme={theme} />
            </View>
            <View style={[styles.titleCopy, compact && { alignItems: "center" }]}>
              <Text style={styles.titleEyebrow}>Lộ trình luyện tập lớp {grade}</Text>
              <Text style={[styles.titleText, compact && { textAlign: "center" }]}>{theme.title}</Text>
              {!compact ? <Text style={styles.titleSubtitle}>{theme.subtitle}</Text> : null}
            </View>
          </View>
          <View style={styles.progressBox}>
            <View style={styles.progressCopy}>
              <Text style={styles.progressLabel}>Tiến độ</Text>
              <Text style={styles.progressValue}>{completedCount}/{lessonsWithStatus.length}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { backgroundColor: theme.primary, width: `${completion * 100}%` }]} />
            </View>
          </View>
        </View>
        <View style={styles.roundControl}>
          <Ionicons name="trophy" size={19} color="#ffffff" />
          <Text style={styles.scoreText}>{completedCount}</Text>
        </View>
      </View>

      {!routeGrade ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gradeRow}>
        {availableGrades.map((item) => {
          const active = grade === item;
          const itemTheme = CLASS_THEMES[item];
          return (
            <Pressable key={item} onPress={() => setGrade(item)} style={[styles.gradeChip, active ? { backgroundColor: itemTheme.primary, borderColor: itemTheme.primaryDark } : null]}>
              <Text style={[styles.gradeText, active ? styles.gradeTextActive : null]}>Lớp {item}</Text>
            </Pressable>
          );
        })}
      </ScrollView> : null}

      {placementManaged && !isPlaced ? (
        <View style={styles.placementCard}>
          <View style={styles.placementIcon}><Ionicons name="school-outline" size={29} color="#ffffff" /></View>
          <View style={styles.placementCopy}>
            <Text style={styles.placementEyebrow}>Xếp lớp ban đầu</Text>
            <Text style={styles.placementTitle}>Xác nhận hành trình khối {grade}</Text>
            <Text style={styles.placementText}>Hoàn thành bài đánh giá được chấm trên máy chủ để mở bản đồ học tập.</Text>
          </View>
          <Pressable onPress={startPlacement} disabled={startingAssessment} style={styles.placementButton}>
            {startingAssessment ? <ActivityIndicator color="#1e3a8a" /> : (
              <><Text style={styles.placementButtonText}>Bắt đầu đánh giá</Text><Ionicons name="arrow-forward" size={18} color="#1e3a8a" /></>
            )}
          </Pressable>
        </View>
      ) : null}

      {showOptionalTest ? (
        <View style={styles.optionalTestCard}>
          <View style={styles.optionalTestIcon}><Ionicons name="rocket-outline" size={26} color="#ffffff" /></View>
          <View style={styles.optionalTestCopy}>
            <Text style={styles.optionalTestEyebrow}>Hành trình vượt cấp</Text>
            <Text style={styles.optionalTestTitle}>Mở lộ trình lớp {grade}</Text>
            <Text style={styles.optionalTestText}>Làm bài kiểm tra đầu vào để mở khóa chương trình lớp {grade} ngay khi bạn đã sẵn sàng.</Text>
          </View>
          <Pressable onPress={startOptionalTest} disabled={startingAssessment} style={styles.optionalTestButton}>
            {startingAssessment ? <ActivityIndicator color="#ffffff" /> : <><Text style={styles.optionalTestButtonText}>Làm bài kiểm tra</Text><Ionicons name="arrow-forward" size={18} color="#ffffff" /></>}
          </Pressable>
        </View>
      ) : null}

      {lessonResource.error ? <ErrorState message={lessonResource.error.message} onRetry={lessonResource.reload} /> : null}
      {canShowJourney && lessonResource.loading && lessons.length === 0 ? (
        <View style={styles.loadingMap}><ActivityIndicator size="large" color={theme.primary} /><Text style={styles.loadingText}>Khai mở bản đồ...</Text></View>
      ) : null}
      {canShowJourney && !lessonResource.loading && !lessonResource.error && lessonsWithStatus.length === 0 ? (
        <EmptyState icon="compass-outline" title="Bản đồ đang được chuẩn bị" subtitle={`Các chặng học của lớp ${grade} sẽ sớm xuất hiện tại đây.`} />
      ) : null}

      {canShowJourney && lessonsWithStatus.length > 0 ? (
        <View onLayout={(event) => setMapWidth(event.nativeEvent.layout.width)} style={[styles.map, { height: mapHeight }]} accessibilityLabel={`Bản đồ hành trình lớp ${grade}`}>
          {Array.from({ length: Math.ceil(mapHeight / 448) + 1 }, (_, index) => (
            <View key={index} pointerEvents="none" style={[styles.mapTile, { top: index * 448 - 64 }]}>
              <Image source={{ uri: MAP_TILE_URI }} resizeMode="cover" style={[StyleSheet.absoluteFill, { transform: [{ scaleX: index % 2 === 0 ? 1 : -1 }] }]} />
              <LinearGradient colors={["#abe04d", "transparent", "transparent", "#abe04d"]} locations={[0, 0.24, 0.76, 1]} style={StyleSheet.absoluteFill} />
            </View>
          ))}
          <LinearGradient pointerEvents="none" colors={["transparent", "rgba(171,224,77,0.62)", "rgba(171,224,77,0.62)", "transparent"]} locations={[0, 0.32, 0.68, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          <JourneyRail layout={layout} width={mapWidth} highestUnlockedIndex={highestUnlockedIndex} theme={theme} compact={compact} />
          {lessonsWithStatus.map((lesson, index) => (
            <StageNode key={lessonIdOf(lesson) || index} lesson={lesson} index={index} point={points[index]} compact={compact} wide={width > 900} onOpen={openLesson} theme={theme} />
          ))}
        </View>
      ) : null}

      {canShowJourney && lessonsWithStatus.length > 0 ? (
        <Pressable
          disabled={!canOpenNotebook || notebook.loading}
          onPress={openNotebook}
          style={[styles.bookMilestone, !canOpenNotebook ? styles.bookLocked : null]}
        >
          <View style={[styles.bookArt, { backgroundColor: theme.primary, borderBottomColor: theme.primaryDark }]}>
            <View style={styles.bookSpine} /><ThemeGlyph theme={theme} size={27} /><Text style={styles.bookLabel}>Cẩm nang</Text>
          </View>
          <View style={styles.bookCopy}>
            <Text style={styles.bookEyebrow}>✦ Cột mốc đặc biệt</Text>
            <Text style={styles.bookTitle}>{notebook.loading ? "Đang chuẩn bị sổ tay..." : canOpenNotebook ? "Sổ Tay Hóa Học" : "Hoàn thành chặng 1 để mở"}</Text>
            <Text style={styles.bookSubtitle}>Khám phá bản đồ Infographic tổng hợp Lớp {grade}</Text>
          </View>
          <View style={styles.bookAction}>
            <Ionicons name={canOpenNotebook ? "book-outline" : "lock-closed"} size={24} color="#ffffff" />
            <Text style={styles.bookActionText}>{notebook.loading ? 'Đang tải' : canOpenNotebook ? 'Mở sổ tay' : 'Chưa mở'}</Text>
          </View>
        </Pressable>
      ) : null}

      {notebook.error ? <ErrorState message={notebook.error} onRetry={openNotebook} /> : null}
      <JourneyNotebookModal visible={notebookOpen && notebook.grade === grade} onClose={() => setNotebookOpen(false)} lessons={notebook.lessons} grade={grade} user={user} theme={theme} />

      <PlacementAssessmentModal
        mode={assessmentMode}
        assessment={assessment}
        visible={Boolean(assessment)}
        onClose={() => setAssessment(null)}
        onSubmit={submitAssessment}
        onPassed={async (result) => { await refreshProfile(); setGrade(String(result.grade)); setAssessment(null); }}
        onFailed={async () => { await refreshProfile(); setAssessment(null); }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md, paddingHorizontal: 9, paddingTop: 10 },
  headerRow: { alignItems: "flex-start", flexDirection: "row", gap: 6 },
  roundControl: { alignItems: "center", backgroundColor: "#f97316", borderBottomColor: "#c2410c", borderBottomWidth: 4, borderColor: "rgba(255,255,255,0.95)", borderRadius: 27, borderWidth: 4, height: 52, justifyContent: "center", marginTop: 7, width: 52 },
  scoreText: { color: "#ffffff", fontFamily: typography.bold, fontSize: 10, lineHeight: 11 },
  titleBoard: { backgroundColor: "#263541", borderBottomColor: "#9aa6a5", borderBottomWidth: 6, borderColor: "rgba(255,255,255,0.92)", borderRadius: 22, borderWidth: 5, flex: 1, gap: 8, minHeight: 96, padding: 10 },
  titleTop: { alignItems: "center", flexDirection: "row", gap: 9 },
  titleIcon: { alignItems: "center", borderBottomWidth: 4, borderColor: "#ffffff", borderRadius: 14, borderWidth: 3, height: 46, justifyContent: "center", width: 46 },
  themeFormula: { fontFamily: typography.bold, fontWeight: "900", letterSpacing: -1 },
  titleCopy: { flex: 1 },
  titleEyebrow: { color: "#a7f3d0", fontFamily: typography.bold, fontSize: 8, letterSpacing: 1.1, textTransform: "uppercase" },
  titleText: { color: "#ffffff", fontFamily: typography.bold, fontSize: 18, fontWeight: "900", lineHeight: 23, marginTop: 2 },
  titleSubtitle: { color: "rgba(255,255,255,0.62)", fontFamily: typography.medium, fontSize: 10, lineHeight: 14 },
  progressBox: { backgroundColor: "rgba(9,16,24,0.38)", borderColor: "rgba(255,255,255,0.1)", borderRadius: 12, borderWidth: 1, paddingHorizontal: 9, paddingVertical: 7 },
  progressCopy: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  progressLabel: { color: "rgba(255,255,255,0.62)", fontFamily: typography.bold, fontSize: 10 },
  progressValue: { color: "#ffffff", fontFamily: typography.bold, fontSize: 11 },
  progressTrack: { backgroundColor: "rgba(5,10,16,0.55)", borderRadius: 999, height: 8, overflow: "hidden" },
  progressFill: { borderRadius: 999, height: "100%" },
  gradeRow: { gap: 8, paddingHorizontal: 3, paddingRight: 18 },
  gradeChip: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.86)", borderColor: "#d7dfd0", borderRadius: 14, borderWidth: 2, justifyContent: "center", minHeight: 42, minWidth: 68, paddingHorizontal: 12 },
  gradeText: { color: "#405047", fontFamily: typography.bold, fontSize: 12 },
  gradeTextActive: { color: "#ffffff" },
  placementCard: { alignItems: "center", backgroundColor: "#1e3a8a", borderBottomColor: "#1e2a6a", borderBottomWidth: 5, borderColor: "rgba(255,255,255,0.92)", borderRadius: 20, borderWidth: 3, gap: 10, padding: 14 },
  placementIcon: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 15, height: 52, justifyContent: "center", width: 52 },
  placementCopy: { alignItems: "center", gap: 3 },
  placementEyebrow: { color: "#a5f3fc", fontFamily: typography.bold, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" },
  placementTitle: { color: "#ffffff", fontFamily: typography.bold, fontSize: 18, textAlign: "center" },
  placementText: { color: "rgba(255,255,255,0.72)", fontFamily: typography.medium, fontSize: 12, lineHeight: 18, textAlign: "center" },
  placementButton: { alignItems: "center", alignSelf: "stretch", backgroundColor: "#ffffff", borderBottomColor: "#cbd5e1", borderBottomWidth: 4, borderRadius: 14, flexDirection: "row", gap: 7, justifyContent: "center", minHeight: 48 },
  placementButtonText: { color: "#1e3a8a", fontFamily: typography.bold, fontSize: 13 },
  optionalTestCard: { alignItems: "center", backgroundColor: "#1e3a8a", borderBottomColor: "#1e2a6a", borderBottomWidth: 5, borderColor: "rgba(255,255,255,0.92)", borderRadius: 20, borderWidth: 3, gap: 10, padding: 14 },
  optionalTestIcon: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 15, height: 50, justifyContent: "center", width: 50 },
  optionalTestCopy: { alignItems: "center", gap: 3 },
  optionalTestEyebrow: { color: "#c4b5fd", fontFamily: typography.bold, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" },
  optionalTestTitle: { color: "#ffffff", fontFamily: typography.bold, fontSize: 18, textAlign: "center" },
  optionalTestText: { color: "rgba(255,255,255,0.72)", fontFamily: typography.medium, fontSize: 12, lineHeight: 18, textAlign: "center" },
  optionalTestButton: { alignItems: "center", alignSelf: "stretch", backgroundColor: "#6366f1", borderBottomColor: "#4338ca", borderBottomWidth: 4, borderRadius: 14, flexDirection: "row", gap: 7, justifyContent: "center", minHeight: 48 },
  optionalTestButtonText: { color: "#ffffff", fontFamily: typography.bold, fontSize: 13 },
  loadingMap: { alignItems: "center", backgroundColor: "rgba(171,224,77,0.72)", borderRadius: 26, gap: 12, justifyContent: "center", minHeight: 330 },
  loadingText: { color: "#315141", fontFamily: typography.bold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" },
  map: { backgroundColor: "#abe04d", borderRadius: 28, overflow: "hidden", position: "relative" },
  mapTile: { height: 640, left: 0, position: "absolute", width: "100%" },
  mapTint: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(171,224,77,0.22)" },
  stageNode: { alignItems: "center", marginLeft: -58.8, position: "absolute", width: 117.6, zIndex: 5 },
  stagePressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  stageLocked: { opacity: 0.76 },
  stageStack: { alignItems: "center", width: 104 },
  stagePlaque: { alignItems: "center", borderBottomWidth: 5, borderColor: "rgba(255,255,255,0.96)", borderRadius: 17, borderWidth: 4, height: 70.4, justifyContent: "center", marginBottom: -10.88, position: "relative", width: 76, zIndex: 2 },
  stageKicker: { color: "#ffffff", fontFamily: typography.bold, fontSize: 9, lineHeight: 11, textTransform: "uppercase" },
  stageNumber: { color: "#ffffff", fontFamily: typography.bold, fontSize: 32, fontWeight: "900", lineHeight: 34 },
  stageStatusBadge: { alignItems: "center", backgroundColor: "#fde047", borderColor: "#ffffff", borderRadius: 15, borderWidth: 2, height: 27, justifyContent: "center", position: "absolute", right: -10, top: -10, width: 27 },
  stagePedestal: { backgroundColor: "#445856", borderBottomColor: "#314240", borderBottomWidth: 6, borderColor: "rgba(255,255,255,0.38)", borderRadius: 19, borderWidth: 2, height: 42.4, position: "relative", width: 100 },
  stagePedestalTop: { backgroundColor: "rgba(184,211,194,0.18)", borderRadius: 999, height: 10, left: 14, position: "absolute", right: 14, top: 5 },
  stageCaption: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.93)", borderBottomColor: "rgba(55,94,50,0.2)", borderBottomWidth: 4, borderColor: "rgba(255,255,255,0.96)", borderRadius: 13, borderWidth: 2, marginTop: 7, minHeight: 59, paddingHorizontal: 7, paddingVertical: 7, width: 117.6 },
  stageTitle: { color: "#31433b", fontFamily: typography.bold, fontSize: 14, fontWeight: "800", lineHeight: 16, textAlign: "center" },
  starRow: { flexDirection: "row", gap: 1, marginTop: 3 },
  nextStep: { fontFamily: typography.bold, fontSize: 8, marginTop: 2, textTransform: "uppercase" },
  bookMilestone: { alignItems: "center", backgroundColor: "#263541", borderBottomColor: "#172033", borderBottomWidth: 6, borderColor: "rgba(255,255,255,0.96)", borderRadius: 22, borderWidth: 4, flexDirection: "row", flexWrap: 'wrap', gap: 16, marginHorizontal: 6, padding: 18 },
  bookAction: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)' },
  bookActionText: { color: '#ffffff', fontFamily: typography.bold, fontSize: 13 },
  bookLocked: { opacity: 0.7 },
  bookArt: { alignItems: "center", borderBottomWidth: 5, borderColor: "rgba(255,255,255,0.2)", borderRadius: 9, borderWidth: 2, height: 93, justifyContent: "center", overflow: "hidden", position: "relative", width: 77 },
  bookSpine: { backgroundColor: "rgba(15,23,42,0.38)", bottom: 0, left: 0, position: "absolute", top: 0, width: 8 },
  bookLabel: { color: "rgba(255,255,255,0.72)", fontFamily: typography.bold, fontSize: 7, letterSpacing: 0.7, marginTop: 4, textTransform: "uppercase" },
  bookCopy: { flex: 1 },
  bookEyebrow: { color: "#fde68a", fontFamily: typography.bold, fontSize: 9, letterSpacing: 0.7, textTransform: "uppercase" },
  bookTitle: { color: "#ffffff", fontFamily: typography.bold, fontSize: 16, lineHeight: 21, marginTop: 3 },
  bookSubtitle: { color: "rgba(255,255,255,0.65)", fontFamily: typography.medium, fontSize: 14, lineHeight: 20, marginTop: 2 }
});
