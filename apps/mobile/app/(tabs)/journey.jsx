import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { EmptyState, ErrorState, Screen } from "../../components/ui/Primitives";
import PlacementAssessmentModal from "../../components/journey/PlacementAssessmentModal";
import JourneyNotebookModal from "../../components/journey/JourneyNotebookModal";
import { spacing, typography } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { learningApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";

const GRADES = ["6", "7", "8", "9", "10", "11", "12"];
const LEVELS = ["level1", "level2", "level3"];
const OPTIONAL_PLACEMENT_GRADES = new Set(["9", "10", "11", "12"]);
const MAP_TILE_URI = "https://res.cloudinary.com/dpcorzgkm/image/upload/aurum/public/assets/images/journey-chemistry-map-bg.png";

const CLASS_THEMES = {
  "6": { title: "Nền Tảng Chất Quanh Ta", subtitle: "Làm quen an toàn, đo lường, vật liệu và hỗn hợp", primary: "#0ea5e9", primaryDark: "#0369a1", symbol: "H₂O" },
  "7": { title: "Nhập Môn Tự Nhiên", subtitle: "Khám phá phương pháp khoa học và cấu tạo chất", primary: "#06b6d4", primaryDark: "#0e7490", icon: "flask-outline" },
  "8": { title: "Hành Trình Khởi Đầu", subtitle: "Làm chủ các nguyên tố hóa học cơ bản", primary: "#65b82e", primaryDark: "#3f7f1d", symbol: "O₂" },
  "9": { title: "Bí Thuật Chuyển Hóa", subtitle: "Bí thuật phản ứng hóa học", primary: "#6366f1", primaryDark: "#4338ca", icon: "flash-outline" },
  "10": { title: "Kiến Trúc Sư Hóa Học", subtitle: "Xây dựng thế giới điểm học tập", primary: "#14b8a6", primaryDark: "#0f766e", icon: "nuclear-outline" },
  "11": { title: "Thế Giới Hữu Cơ", subtitle: "Khám phá cấu trúc mạch carbon và nhóm chức", primary: "#f43f5e", primaryDark: "#be123c", icon: "git-network-outline" },
  "12": { title: "Chinh Phục Thực Tiễn", subtitle: "Ứng dụng hóa học vào đời sống và công nghệ", primary: "#f59e0b", primaryDark: "#b45309", icon: "radioactive-outline" }
};

const lessonIdOf = (lesson) => lesson?.lessonId || lesson?.id;
const starsOf = (user, lessonId) => user?.balancingProgress?.lessonStars?.[lessonId] || {};
const isFinished = (stars) => LEVELS.every((level) => Number(stars?.[level] || 0) > 0);
const cleanLessonTitle = (lesson, index) => lesson?.title?.split(": ").pop() || `Bài học ${index + 1}`;

const ThemeGlyph = ({ theme, color = "#ffffff", size = 24 }) => theme.icon ? (
  <Ionicons name={theme.icon} size={size} color={color} />
) : (
  <Text style={[styles.themeFormula, { color, fontSize: size * 0.72 }]}>{theme.symbol}</Text>
);

const RailSegment = ({ from, to, mapWidth, active, theme }) => {
  const x1 = (from.x / 100) * mapWidth;
  const x2 = (to.x / 100) * mapWidth;
  const dx = x2 - x1;
  const dy = to.y - from.y;
  const length = Math.sqrt((dx * dx) + (dy * dy));
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const left = ((x1 + x2) / 2) - (length / 2);
  const middleY = (from.y + to.y) / 2;
  const lineStyle = { left, width: length, transform: [{ rotate: `${angle}deg` }] };
  const sleeperCount = Math.max(3, Math.floor(length / 30));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.railShadow, lineStyle, { top: middleY - 36 }]} />
      <View style={[styles.railBed, lineStyle, { top: middleY - 32 }]} />
      {Array.from({ length: sleeperCount }, (_, index) => {
        const ratio = (index + 0.5) / sleeperCount;
        const x = x1 + (dx * ratio);
        const y = from.y + (dy * ratio);
        return <View key={index} style={[styles.railSleeper, { left: x - 17, top: y - 3, transform: [{ rotate: `${angle + 90}deg` }] }]} />;
      })}
      <View style={[styles.railLine, lineStyle, { top: middleY - 6 }]} />
      {active ? <View style={[styles.railProgress, lineStyle, { backgroundColor: theme.primary, top: middleY - 3 }]} /> : null}
    </View>
  );
};

const StageNode = ({ lesson, index, point, onOpen, theme }) => {
  const completedLevels = LEVELS.filter((level) => Number(lesson.stars?.[level] || 0) > 0).length;
  const plaqueColor = lesson.isCompleted ? theme.primary : lesson.isUnlocked ? "#f97316" : "#64748b";
  const plaqueDark = lesson.isCompleted ? theme.primaryDark : lesson.isUnlocked ? "#c2410c" : "#475569";

  return (
    <Pressable
      disabled={!lesson.isUnlocked}
      onPress={() => onOpen(lesson)}
      accessibilityLabel={`Chặng ${index + 1}: ${cleanLessonTitle(lesson, index)}`}
      style={({ pressed }) => [
        styles.stageNode,
        { left: `${point.x}%`, top: point.y - 55 },
        pressed && lesson.isUnlocked ? styles.stagePressed : null,
        !lesson.isUnlocked ? styles.stageLocked : null
      ]}
    >
      <View style={styles.stageStack}>
        <View style={[styles.stagePlaque, { backgroundColor: plaqueColor, borderBottomColor: plaqueDark }]}>
          <Text style={styles.stageKicker}>Chặng</Text>
          <Text style={styles.stageNumber}>{index + 1}</Text>
          <View style={styles.stageStatusBadge}>
            <Ionicons name={lesson.isCompleted ? "trophy" : lesson.isUnlocked ? "play" : "lock-closed"} size={12} color="#7c2d12" />
          </View>
        </View>
        <View style={styles.stagePedestal}>
          <View style={styles.stagePedestalTop} />
        </View>
      </View>
      <View style={styles.stageCaption}>
        <Text style={styles.stageTitle} numberOfLines={2}>{cleanLessonTitle(lesson, index)}</Text>
        <View style={styles.starRow}>
          {LEVELS.map((level) => (
            <Ionicons key={level} name="star" size={13} color={Number(lesson.stars?.[level] || 0) > 0 ? "#fbbf24" : "#cbd5e1"} />
          ))}
        </View>
        {lesson.isUnlocked && !lesson.isCompleted ? <Text style={[styles.nextStep, { color: theme.primaryDark }]}>Vòng {completedLevels + 1}/3</Text> : null}
      </View>
    </Pressable>
  );
};

export default function JourneyTab() {
  const { token, user, refreshProfile } = useAuth();
  const placement = user?.balancingProgress?.placement;
  const placementManaged = user?.role === "student" && placement?.required === true;
  const isPlaced = placementManaged && placement?.status === "placed" && GRADES.includes(String(placement?.assignedGrade));
  const placedGrade = isPlaced ? String(placement.assignedGrade) : "";
  const defaultGrade = placedGrade || String(user?.studyPlan?.grade || "8");
  const availableGrades = isPlaced ? [placedGrade] : GRADES;
  const [grade, setGrade] = React.useState(availableGrades.includes(defaultGrade) ? defaultGrade : availableGrades[0]);
  const [mapWidth, setMapWidth] = React.useState(340);
  const [assessment, setAssessment] = React.useState(null);
  const [assessmentMode, setAssessmentMode] = React.useState("initial");
  const [notebookOpen, setNotebookOpen] = React.useState(false);
  const [startingAssessment, setStartingAssessment] = React.useState(false);
  const theme = CLASS_THEMES[grade] || CLASS_THEMES["8"];

  React.useEffect(() => {
    if (isPlaced && grade !== placedGrade) setGrade(placedGrade);
  }, [grade, isPlaced, placedGrade]);

  const lessonResource = useApiResource(
    () => learningApi.bai_hoc({ classId: Number(grade) }),
    [grade]
  );
  const lessons = lessonResource.data || [];
  const firstLessonDefaultUnlocked = ["6", "7", "8"].includes(grade);
  const gradePassed = user?.balancingProgress?.passedGrades?.includes(grade);

  const lessonsWithStatus = lessons.map((lesson, index) => {
    const lessonId = lessonIdOf(lesson);
    const stars = starsOf(user, lessonId);
    const previousStars = index > 0 ? starsOf(user, lessonIdOf(lessons[index - 1])) : null;
    const completed = isFinished(stars);
    const unlocked = user?.role === "admin"
      || user?.role === "teacher"
      || (index === 0 && (firstLessonDefaultUnlocked || gradePassed || placedGrade === grade))
      || (previousStars && isFinished(previousStars))
      || completed;
    return { ...lesson, stars, isCompleted: completed, isUnlocked: Boolean(unlocked) };
  });

  const completedCount = lessonsWithStatus.filter((lesson) => lesson.isCompleted).length;
  let highestUnlockedIndex = -1;
  lessonsWithStatus.forEach((lesson, index) => {
    if (lesson.isUnlocked) highestUnlockedIndex = index;
  });

  const points = lessonsWithStatus.map((_, index) => ({ x: index % 2 === 0 ? 28 : 72, y: 110 + (index * 220) }));
  const mapHeight = Math.max(340, 280 + (Math.max(0, lessonsWithStatus.length - 1) * 220));
  const completion = lessonsWithStatus.length ? completedCount / lessonsWithStatus.length : 0;
  const canShowJourney = !placementManaged || isPlaced;
  const canOpenNotebook = Boolean(lessonsWithStatus[0]?.isCompleted || ["teacher", "admin"].includes(user?.role));
  const showOptionalTest = !placementManaged
    && user?.role === "student"
    && OPTIONAL_PLACEMENT_GRADES.has(grade)
    && lessonsWithStatus.length > 0
    && !user?.balancingProgress?.passedGrades?.includes(grade)
    && !user?.unlockedLessons?.map(String).includes(String(lessonIdOf(lessonsWithStatus[0])));

  const openLesson = (lesson) => {
    router.push({ pathname: "/journey/[grade]/[lessonId]", params: { grade, lessonId: lessonIdOf(lesson) } });
  };

  const startPlacement = async () => {
    if (startingAssessment) return;
    setStartingAssessment(true);
    try {
      const response = await learningApi.startPlacement(token, grade);
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

  return (
    <Screen style={styles.page}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.push("/classroom")} style={styles.roundControl} accessibilityLabel="Quay lại lớp học">
          <Ionicons name="chevron-back" size={27} color="#ffffff" />
        </Pressable>
        <View style={styles.titleBoard}>
          <View style={styles.titleTop}>
            <View style={[styles.titleIcon, { backgroundColor: theme.primary, borderBottomColor: theme.primaryDark }]}>
              <ThemeGlyph theme={theme} />
            </View>
            <View style={styles.titleCopy}>
              <Text style={styles.titleEyebrow}>Lộ trình luyện tập lớp {grade}</Text>
              <Text style={styles.titleText} numberOfLines={1}>{theme.title}</Text>
              <Text style={styles.titleSubtitle} numberOfLines={1}>{theme.subtitle}</Text>
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gradeRow}>
        {availableGrades.map((item) => {
          const active = grade === item;
          const itemTheme = CLASS_THEMES[item];
          return (
            <Pressable key={item} onPress={() => setGrade(item)} style={[styles.gradeChip, active ? { backgroundColor: itemTheme.primary, borderColor: itemTheme.primaryDark } : null]}>
              <Text style={[styles.gradeText, active ? styles.gradeTextActive : null]}>Lớp {item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

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
            <Text style={styles.optionalTestTitle}>Mở nhanh lộ trình lớp {grade}</Text>
            <Text style={styles.optionalTestText}>Đạt 70% bài kiểm tra nền tảng để mở chặng đầu tiên và nhận 500 XP.</Text>
          </View>
          <Pressable onPress={startOptionalTest} disabled={startingAssessment} style={styles.optionalTestButton}>
            {startingAssessment ? <ActivityIndicator color="#ffffff" /> : <><Text style={styles.optionalTestButtonText}>Làm bài kiểm tra</Text><Ionicons name="arrow-forward" size={18} color="#ffffff" /></>}
          </Pressable>
        </View>
      ) : null}

      {lessonResource.error ? <ErrorState message={lessonResource.error.message} onRetry={lessonResource.reload} /> : null}
      {canShowJourney && lessonResource.loading && !lessonResource.data ? (
        <View style={styles.loadingMap}><ActivityIndicator size="large" color={theme.primary} /><Text style={styles.loadingText}>Khai mở bản đồ...</Text></View>
      ) : null}
      {canShowJourney && !lessonResource.loading && !lessonResource.error && lessonsWithStatus.length === 0 ? (
        <EmptyState icon="compass-outline" title="Bản đồ đang được chuẩn bị" subtitle={`Các chặng học của lớp ${grade} sẽ sớm xuất hiện tại đây.`} />
      ) : null}

      {canShowJourney && lessonsWithStatus.length > 0 ? (
        <View onLayout={(event) => setMapWidth(event.nativeEvent.layout.width)} style={[styles.map, { height: mapHeight }]} accessibilityLabel={`Bản đồ hành trình lớp ${grade}`}>
          {Array.from({ length: Math.ceil(mapHeight / 620) }, (_, index) => (
            <Image key={index} source={{ uri: MAP_TILE_URI }} resizeMode="cover" style={[styles.mapTile, { top: index * 610, transform: [{ scaleX: index % 2 === 0 ? 1 : -1 }] }]} />
          ))}
          <View style={styles.mapTint} pointerEvents="none" />
          {points.slice(0, -1).map((point, index) => (
            <RailSegment key={index} from={point} to={points[index + 1]} mapWidth={mapWidth} active={index < highestUnlockedIndex} theme={theme} />
          ))}
          {lessonsWithStatus.map((lesson, index) => (
            <StageNode key={lessonIdOf(lesson) || index} lesson={lesson} index={index} point={points[index]} onOpen={openLesson} theme={theme} />
          ))}
        </View>
      ) : null}

      {canShowJourney && lessonsWithStatus.length > 0 ? (
        <Pressable
          disabled={!canOpenNotebook}
          onPress={() => setNotebookOpen(true)}
          style={[styles.bookMilestone, !canOpenNotebook ? styles.bookLocked : null]}
        >
          <View style={[styles.bookArt, { backgroundColor: theme.primary, borderBottomColor: theme.primaryDark }]}>
            <View style={styles.bookSpine} /><ThemeGlyph theme={theme} size={27} /><Text style={styles.bookLabel}>Cẩm nang</Text>
          </View>
          <View style={styles.bookCopy}>
            <Text style={styles.bookEyebrow}>✦ Cột mốc đặc biệt</Text>
            <Text style={styles.bookTitle}>{canOpenNotebook ? "Sổ Tay Hóa Học" : "Hoàn thành chặng 1 để mở"}</Text>
            <Text style={styles.bookSubtitle}>Khám phá bản đồ Infographic tổng hợp Lớp {grade}</Text>
          </View>
          <Ionicons name={canOpenNotebook ? "book-outline" : "lock-closed"} size={24} color="#ffffff" />
        </Pressable>
      ) : null}

      <JourneyNotebookModal visible={notebookOpen} onClose={() => setNotebookOpen(false)} lessons={lessonsWithStatus} grade={grade} user={user} theme={theme} />

      <PlacementAssessmentModal
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
  titleBoard: { backgroundColor: "#263541", borderBottomColor: "#9aa6a5", borderBottomWidth: 6, borderColor: "rgba(255,255,255,0.92)", borderRadius: 22, borderWidth: 5, flex: 1, gap: 8, minHeight: 126, padding: 10 },
  titleTop: { alignItems: "center", flexDirection: "row", gap: 9 },
  titleIcon: { alignItems: "center", borderBottomWidth: 4, borderColor: "#ffffff", borderRadius: 14, borderWidth: 3, height: 46, justifyContent: "center", width: 46 },
  themeFormula: { fontFamily: typography.bold, fontWeight: "900", letterSpacing: -1 },
  titleCopy: { flex: 1 },
  titleEyebrow: { color: "#a7f3d0", fontFamily: typography.bold, fontSize: 8, letterSpacing: 1.1, textTransform: "uppercase" },
  titleText: { color: "#ffffff", fontFamily: typography.bold, fontSize: 16, lineHeight: 21, marginTop: 2 },
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
  optionalTestCard: { alignItems: "center", backgroundColor: "#312e81", borderBottomColor: "#1e1b4b", borderBottomWidth: 5, borderColor: "rgba(255,255,255,0.92)", borderRadius: 20, borderWidth: 3, gap: 10, padding: 14 },
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
  mapTile: { height: 690, left: 0, opacity: 0.72, position: "absolute", width: "100%" },
  mapTint: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(171,224,77,0.22)" },
  railShadow: { backgroundColor: "rgba(75,47,26,0.28)", borderRadius: 40, height: 72, position: "absolute" },
  railBed: { backgroundColor: "#bd7c3c", borderRadius: 36, height: 64, position: "absolute", top: 4 },
  railSleeper: { backgroundColor: "#f5bf6c", borderRadius: 2, height: 6, position: "absolute", width: 34 },
  railLine: { backgroundColor: "#fff8da", borderRadius: 9, height: 12, position: "absolute", top: 30 },
  railProgress: { borderRadius: 5, height: 6, position: "absolute", top: 33 },
  stageNode: { alignItems: "center", marginLeft: -66, position: "absolute", width: 132, zIndex: 5 },
  stagePressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  stageLocked: { opacity: 0.76 },
  stageStack: { alignItems: "center", width: 104 },
  stagePlaque: { alignItems: "center", borderBottomWidth: 5, borderColor: "rgba(255,255,255,0.96)", borderRadius: 17, borderWidth: 4, height: 76, justifyContent: "center", marginBottom: -8, position: "relative", width: 76, zIndex: 2 },
  stageKicker: { color: "#ffffff", fontFamily: typography.bold, fontSize: 9, lineHeight: 11, textTransform: "uppercase" },
  stageNumber: { color: "#ffffff", fontFamily: typography.bold, fontSize: 29, lineHeight: 32 },
  stageStatusBadge: { alignItems: "center", backgroundColor: "#fde047", borderColor: "#ffffff", borderRadius: 15, borderWidth: 2, height: 27, justifyContent: "center", position: "absolute", right: -10, top: -10, width: 27 },
  stagePedestal: { backgroundColor: "#445856", borderBottomColor: "#314240", borderBottomWidth: 6, borderColor: "rgba(255,255,255,0.38)", borderRadius: 19, borderWidth: 2, height: 38, position: "relative", width: 100 },
  stagePedestalTop: { backgroundColor: "rgba(184,211,194,0.18)", borderRadius: 999, height: 10, left: 14, position: "absolute", right: 14, top: 5 },
  stageCaption: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.93)", borderBottomColor: "rgba(55,94,50,0.2)", borderBottomWidth: 4, borderColor: "rgba(255,255,255,0.96)", borderRadius: 13, borderWidth: 2, marginTop: 7, minHeight: 59, paddingHorizontal: 7, paddingVertical: 6, width: 122 },
  stageTitle: { color: "#31433b", fontFamily: typography.bold, fontSize: 12, lineHeight: 15, textAlign: "center" },
  starRow: { flexDirection: "row", gap: 1, marginTop: 3 },
  nextStep: { fontFamily: typography.bold, fontSize: 8, marginTop: 2, textTransform: "uppercase" },
  bookMilestone: { alignItems: "center", backgroundColor: "#263541", borderBottomColor: "#172033", borderBottomWidth: 6, borderColor: "rgba(255,255,255,0.96)", borderRadius: 22, borderWidth: 4, flexDirection: "row", gap: 12, marginHorizontal: 6, padding: 14 },
  bookLocked: { opacity: 0.7 },
  bookArt: { alignItems: "center", borderBottomWidth: 5, borderColor: "rgba(255,255,255,0.2)", borderRadius: 9, borderWidth: 2, height: 76, justifyContent: "center", overflow: "hidden", position: "relative", width: 61 },
  bookSpine: { backgroundColor: "rgba(15,23,42,0.38)", bottom: 0, left: 0, position: "absolute", top: 0, width: 8 },
  bookLabel: { color: "rgba(255,255,255,0.72)", fontFamily: typography.bold, fontSize: 7, letterSpacing: 0.7, marginTop: 4, textTransform: "uppercase" },
  bookCopy: { flex: 1 },
  bookEyebrow: { color: "#fde68a", fontFamily: typography.bold, fontSize: 9, letterSpacing: 0.7, textTransform: "uppercase" },
  bookTitle: { color: "#ffffff", fontFamily: typography.bold, fontSize: 16, lineHeight: 21, marginTop: 3 },
  bookSubtitle: { color: "rgba(255,255,255,0.65)", fontFamily: typography.medium, fontSize: 11, lineHeight: 16, marginTop: 2 }
});
