import React from "react";
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, EmptyState, GhostButton, Pill, PrimaryButton, ProgressBar } from "../ui/Primitives";
import { colors, radius, spacing, typography } from "../../constants/theme";

const PASSING_PERCENT = 70;

const stages = [
  { key: "level1", title: "Khám phá", subtitle: "Đọc ý chính và tự kiểm tra", icon: "book-outline" },
  { key: "level2", title: "Luyện tập", subtitle: "Áp dụng kiến thức vào câu hỏi", icon: "flask-outline" },
  { key: "level3", title: "Chinh phục", subtitle: "Kiểm tra tổng kết bài học", icon: "trophy-outline" }
];

const cleanText = (value) => String(value || "")
  .replace(/\*\*/g, "")
  .replace(/\$(.*?)\$/g, "$1")
  .replace(/\\rightarrow|→/g, "→")
  .replace(/\\uparrow/g, "↑")
  .replace(/\\downarrow/g, "↓")
  .replace(/\s+/g, " ")
  .trim();

const contentToText = (content) => {
  if (typeof content === "string") return cleanText(content);
  if (!content || typeof content !== "object") return "";
  return cleanText(content.text || content.content || content.description || content.title || "");
};

const getQuizGroups = (lesson) => {
  const quizzes = lesson?.quizzes;
  if (Array.isArray(quizzes)) {
    return { level1: quizzes, level2: quizzes, level3: quizzes };
  }
  return {
    level1: Array.isArray(quizzes?.level1) ? quizzes.level1 : [],
    level2: Array.isArray(quizzes?.level2) ? quizzes.level2 : [],
    level3: Array.isArray(quizzes?.level3) ? quizzes.level3 : []
  };
};

const getQuestionsForLevel = (lesson, level) => {
  const groups = getQuizGroups(lesson);
  const gameLevel = level === "level1" ? "basic" : level === "level2" ? "intermediate" : "advanced";
  const gameQuestions = Array.isArray(lesson?.game?.[gameLevel]) ? lesson.game[gameLevel] : [];
  const challengeQuestions = (lesson?.challenges || []).filter((question) => Array.isArray(question?.options));
  const orderedSources = level === "level1"
    ? [groups.level1, gameQuestions, challengeQuestions, groups.level2, groups.level3]
    : level === "level2"
      ? [groups.level2, gameQuestions, challengeQuestions, groups.level1, groups.level3]
      : [groups.level3, gameQuestions, groups.level2, groups.level1, challengeQuestions];

  const questions = orderedSources.find((items) => items.some((question) => question?.question && (Array.isArray(question?.options) || question?.correctAnswer !== undefined || question?.answer !== undefined))) || [];
  return questions.slice(0, 8);
};

const getCorrectAnswer = (question) => question?.answer ?? question?.correctAnswer;

const isSupportedQuestion = (question) => Array.isArray(question?.options) || typeof getCorrectAnswer(question) === "string" || typeof getCorrectAnswer(question) === "number";

const answerIsCorrect = (question, answer) => {
  const correct = getCorrectAnswer(question);
  if (Array.isArray(question?.options)) return Number(answer) === Number(correct);
  return cleanText(answer).toLocaleLowerCase("vi") === cleanText(correct).toLocaleLowerCase("vi");
};

const getStars = (correct, total) => {
  if (!total) return 0;
  const accuracy = correct / total;
  if (accuracy >= 0.9) return 3;
  if (accuracy >= PASSING_PERCENT / 100) return 2;
  return 1;
};

const ModuleContent = ({ module, position, total }) => {
  const content = module?.content || module?.text || module?.description;
  const type = module?.type || "markdown";
  const title = module?.title || module?.heading || (type === "heading" ? contentToText(content) : "Ý chính");
  const listItems = Array.isArray(content?.items) ? content.items : [];
  const body = contentToText(content);

  return (
    <Card accent={colors.green} style={styles.moduleCard}>
      <View style={styles.moduleTop}>
        <Pill label={`Ý ${position}/${total}`} color={colors.green} icon="bulb-outline" />
        <Text style={styles.moduleType}>{type === "infoBox" ? "Ghi nhớ" : "Kiến thức trọng tâm"}</Text>
      </View>
      <Text style={styles.moduleTitle}>{title}</Text>
      {type === "infoBox" && content?.title && content?.title !== title ? <Text style={styles.infoTitle}>{content.title}</Text> : null}
      {listItems.length ? (
        <View style={styles.bulletStack}>
          {listItems.map((item, index) => (
            <View key={`${index}-${item}`} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.moduleBody}>{cleanText(item)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.moduleBody}>{body || "Nội dung đang được cập nhật cho bài học này."}</Text>
      )}
    </Card>
  );
};

const QuestionRunner = ({ title, questions, onComplete, saving }) => {
  const supportedQuestions = React.useMemo(() => questions.filter(isSupportedQuestion), [questions]);
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [correctCount, setCorrectCount] = React.useState(0);
  const [feedback, setFeedback] = React.useState(null);
  const [done, setDone] = React.useState(false);

  const restart = () => {
    setIndex(0);
    setAnswer("");
    setCorrectCount(0);
    setFeedback(null);
    setDone(false);
  };

  if (!supportedQuestions.length) {
    return (
      <EmptyState
        icon="construct-outline"
        title="Bài này chưa có câu tự kiểm hợp lệ"
        subtitle="Bạn vẫn có thể đọc nội dung, nhưng hệ thống sẽ không ghi nhận hoàn thành cho đến khi giáo viên bổ sung bài luyện tập."
      />
    );
  }

  const question = supportedQuestions[index];
  const total = supportedQuestions.length;
  const canCheck = Array.isArray(question.options) ? answer !== "" : String(answer).trim().length > 0;
  const submitCurrent = () => {
    if (!canCheck || feedback) return;
    const isCorrect = answerIsCorrect(question, answer);
    setFeedback({ isCorrect, message: isCorrect ? "Chính xác. Hãy tiếp tục!" : "Chưa đúng. Đọc lại lời giải và ghi nhớ ý này." });
  };

  const moveNext = async () => {
    const nextCorrectCount = correctCount + (feedback?.isCorrect ? 1 : 0);
    if (index < total - 1) {
      setCorrectCount(nextCorrectCount);
      setIndex((current) => current + 1);
      setAnswer("");
      setFeedback(null);
      return;
    }

    const accuracy = Math.round((nextCorrectCount / total) * 100);
    if (accuracy < PASSING_PERCENT) {
      setCorrectCount(nextCorrectCount);
      setDone({ passed: false, accuracy, stars: getStars(nextCorrectCount, total) });
      return;
    }

    setDone({ passed: true, accuracy, stars: getStars(nextCorrectCount, total) });
    await onComplete({ correct: nextCorrectCount, total, stars: getStars(nextCorrectCount, total) });
  };

  if (done) {
    return (
      <Card accent={done.passed ? colors.green : colors.amber} style={styles.resultCard}>
        <Ionicons name={done.passed ? "checkmark-circle-outline" : "refresh-circle-outline"} size={42} color={done.passed ? colors.green : colors.amber} />
        <Text style={styles.resultTitle}>{done.passed ? "Bạn đã qua chặng này" : "Hãy ôn lại rồi làm lại"}</Text>
        <Text style={styles.resultText}>Kết quả: {done.accuracy}% · {done.stars}/3 sao. {done.passed ? "Tiến độ đã được lưu." : `Cần đạt tối thiểu ${PASSING_PERCENT}% để qua chặng.`}</Text>
        {!done.passed ? <PrimaryButton label="Làm lại chặng" icon="refresh-outline" color={colors.amber} onPress={restart} /> : null}
      </Card>
    );
  }

  return (
    <View style={styles.runnerStack}>
      <View style={styles.runnerTop}>
        <View>
          <Text style={styles.runnerTitle}>{title}</Text>
          <Text style={styles.runnerMeta}>Câu {index + 1}/{total} · cần đạt {PASSING_PERCENT}%</Text>
        </View>
        <Pill label={`${correctCount} đúng`} color={colors.green} icon="checkmark-outline" />
      </View>
      <ProgressBar value={index / total} color={colors.green} />
      <Card style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question}</Text>
        {Array.isArray(question.options) ? (
          <View style={styles.optionStack}>
            {question.options.map((option, optionIndex) => {
              const selected = Number(answer) === optionIndex;
              const showCorrect = Boolean(feedback) && Number(getCorrectAnswer(question)) === optionIndex;
              const showWrong = Boolean(feedback) && selected && !feedback.isCorrect;
              return (
                <Pressable
                  key={`${optionIndex}-${option}`}
                  disabled={Boolean(feedback)}
                  onPress={() => setAnswer(String(optionIndex))}
                  style={[styles.option, selected ? styles.optionSelected : null, showCorrect ? styles.optionCorrect : null, showWrong ? styles.optionWrong : null]}
                >
                  <Text style={[styles.optionLetter, selected ? styles.optionLetterSelected : null]}>{String.fromCharCode(65 + optionIndex)}</Text>
                  <Text style={styles.optionText}>{cleanText(option)}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            editable={!feedback}
            placeholder="Nhập câu trả lời của bạn"
            placeholderTextColor="#98a2b3"
            autoCapitalize="sentences"
            style={styles.textAnswer}
          />
        )}
        {feedback ? (
          <View style={[styles.answerFeedback, feedback.isCorrect ? styles.answerFeedbackCorrect : styles.answerFeedbackWrong]}>
            <Ionicons name={feedback.isCorrect ? "checkmark-circle-outline" : "information-circle-outline"} size={20} color={feedback.isCorrect ? colors.greenDark : "#b42318"} />
            <Text style={[styles.answerFeedbackText, feedback.isCorrect ? styles.answerFeedbackTextCorrect : styles.answerFeedbackTextWrong]}>{feedback.message}</Text>
          </View>
        ) : null}
      </Card>
      {feedback ? (
        <PrimaryButton label={index === total - 1 ? "Xem kết quả" : "Câu tiếp theo"} icon="arrow-forward-outline" color={colors.green} onPress={moveNext} disabled={saving} />
      ) : (
        <PrimaryButton label="Kiểm tra đáp án" icon="checkmark-outline" color={colors.green} onPress={submitCurrent} disabled={!canCheck || saving} />
      )}
    </View>
  );
};

export default function LessonPlayer({ lesson, lessonStars, onCompleteLevel }) {
  const theoryModules = Array.isArray(lesson?.theoryModules) ? lesson.theoryModules : [];
  const firstPendingIndex = stages.findIndex((stage) => !(lessonStars?.[stage.key] > 0));
  const unlockedStageIndex = firstPendingIndex >= 0 ? firstPendingIndex : stages.length - 1;
  const [stageIndex, setStageIndex] = React.useState(firstPendingIndex >= 0 ? firstPendingIndex : 0);
  const [theoryIndex, setTheoryIndex] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const activeStage = stages[stageIndex];
  const questions = React.useMemo(() => getQuestionsForLevel(lesson, activeStage.key), [activeStage.key, lesson]);
  const video = lesson?.introVideoUrl || lesson?.videoModules?.find((item) => item?.url)?.url;

  const completeStage = async ({ stars }) => {
    setSaving(true);
    try {
      await onCompleteLevel(activeStage.key, stars);
      if (stageIndex < stages.length - 1) setStageIndex((current) => current + 1);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.playerStack}>
      <View style={styles.stageRow}>
        {stages.map((stage, index) => {
          const completed = lessonStars?.[stage.key] > 0;
          const active = stage.key === activeStage.key;
          const locked = index > unlockedStageIndex;
          return (
            <Pressable key={stage.key} disabled={locked} onPress={() => setStageIndex(index)} style={[styles.stageChip, active ? styles.stageChipActive : null, completed ? styles.stageChipDone : null, locked ? styles.stageChipLocked : null]}>
              <Ionicons name={locked ? "lock-closed-outline" : completed ? "checkmark" : stage.icon} size={16} color={active || completed ? "#ffffff" : colors.greenDark} />
              <Text style={[styles.stageChipText, active || completed ? styles.stageChipTextActive : null]} numberOfLines={1}>{stage.title}</Text>
            </Pressable>
          );
        })}
      </View>

      <Card accent={colors.green} style={styles.stageIntro}>
        <Text style={styles.stageEyebrow}>Chặng {stageIndex + 1}/3</Text>
        <Text style={styles.stageTitle}>{activeStage.title}</Text>
        <Text style={styles.stageDescription}>{activeStage.subtitle}. Bạn cần hoàn thành phần tự kiểm với ít nhất {PASSING_PERCENT}% để lưu tiến độ.</Text>
      </Card>

      {activeStage.key === "level1" && theoryModules.length ? (
        <View style={styles.theoryStack}>
          <ModuleContent module={theoryModules[theoryIndex]} position={theoryIndex + 1} total={theoryModules.length} />
          <View style={styles.theoryActions}>
            <GhostButton label="Ý trước" icon="arrow-back-outline" color={colors.ink} onPress={() => setTheoryIndex((current) => Math.max(0, current - 1))} disabled={theoryIndex === 0} style={styles.halfAction} />
            <PrimaryButton
              label={theoryIndex === theoryModules.length - 1 ? "Vào tự kiểm" : "Ý tiếp theo"}
              icon="arrow-forward-outline"
              color={colors.green}
              onPress={() => theoryIndex === theoryModules.length - 1 ? setTheoryIndex(theoryModules.length) : setTheoryIndex((current) => current + 1)}
              style={styles.halfAction}
            />
          </View>
          {video ? <GhostButton label="Mở video bài giảng" icon="play-circle-outline" color={colors.green} onPress={() => Linking.openURL(video)} /> : null}
          {theoryIndex < theoryModules.length ? (
            <Text style={styles.readingHint}>Đọc hết các ý chính trước khi làm tự kiểm. Bạn có thể quay lại bằng nút “Ý trước”.</Text>
          ) : null}
        </View>
      ) : null}

      {(activeStage.key !== "level1" || theoryIndex >= theoryModules.length || theoryModules.length === 0) ? (
        <QuestionRunner key={activeStage.key} title={`Tự kiểm: ${activeStage.title}`} questions={questions} onComplete={completeStage} saving={saving} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  playerStack: { gap: spacing.md },
  stageRow: { flexDirection: "row", gap: 7 },
  stageChip: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flex: 1, flexDirection: "row", gap: 5, justifyContent: "center", minHeight: 42, paddingHorizontal: 6 },
  stageChipActive: { backgroundColor: colors.green, borderColor: colors.green },
  stageChipDone: { backgroundColor: colors.greenDark, borderColor: colors.greenDark },
  stageChipLocked: { opacity: 0.45 },
  stageChipText: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 11 },
  stageChipTextActive: { color: "#ffffff" },
  stageIntro: { gap: 5 },
  stageEyebrow: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 11, letterSpacing: 0.7, textTransform: "uppercase" },
  stageTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 22, lineHeight: 29 },
  stageDescription: { color: colors.muted, fontFamily: typography.medium, fontSize: 14, lineHeight: 21 },
  theoryStack: { gap: spacing.md },
  moduleCard: { gap: spacing.md },
  moduleTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  moduleType: { color: colors.muted, fontFamily: typography.bold, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" },
  moduleTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 20, lineHeight: 28 },
  infoTitle: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 15, lineHeight: 22 },
  moduleBody: { color: colors.ink, flex: 1, fontFamily: typography.regular, fontSize: 15, lineHeight: 24 },
  bulletStack: { gap: 10 },
  bulletRow: { flexDirection: "row", gap: 10 },
  bulletDot: { backgroundColor: colors.green, borderRadius: 5, height: 8, marginTop: 8, width: 8 },
  theoryActions: { flexDirection: "row", gap: spacing.sm },
  halfAction: { flex: 1 },
  readingHint: { color: colors.muted, fontFamily: typography.medium, fontSize: 12, lineHeight: 18, textAlign: "center" },
  runnerStack: { gap: spacing.md },
  runnerTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  runnerTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 18 },
  runnerMeta: { color: colors.muted, fontFamily: typography.medium, fontSize: 12, marginTop: 3 },
  questionCard: { gap: spacing.md },
  questionText: { color: colors.ink, fontFamily: typography.bold, fontSize: 17, lineHeight: 25 },
  optionStack: { gap: 8 },
  option: { alignItems: "center", backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: 10, minHeight: 56, padding: 10 },
  optionSelected: { borderColor: colors.green, borderWidth: 2 },
  optionCorrect: { backgroundColor: "#eaf6df", borderColor: colors.green },
  optionWrong: { backgroundColor: "#fff0f0", borderColor: colors.red },
  optionLetter: { alignItems: "center", backgroundColor: colors.surface, borderRadius: 12, color: colors.muted, fontFamily: typography.bold, fontSize: 13, height: 28, includeFontPadding: false, justifyContent: "center", paddingTop: 6, textAlign: "center", width: 28 },
  optionLetterSelected: { backgroundColor: colors.green, color: "#ffffff" },
  optionText: { color: colors.ink, flex: 1, fontFamily: typography.medium, fontSize: 14, lineHeight: 20 },
  textAnswer: { backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.ink, fontFamily: typography.regular, fontSize: 15, minHeight: 96, padding: spacing.md, textAlignVertical: "top" },
  answerFeedback: { alignItems: "flex-start", borderRadius: radius.md, flexDirection: "row", gap: 8, padding: spacing.md },
  answerFeedbackCorrect: { backgroundColor: "#eaf6df" },
  answerFeedbackWrong: { backgroundColor: "#fff0f0" },
  answerFeedbackText: { flex: 1, fontFamily: typography.medium, fontSize: 13, lineHeight: 20 },
  answerFeedbackTextCorrect: { color: colors.greenDark },
  answerFeedbackTextWrong: { color: "#b42318" },
  resultCard: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.lg },
  resultTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 20, textAlign: "center" },
  resultText: { color: colors.muted, fontFamily: typography.medium, fontSize: 14, lineHeight: 21, textAlign: "center" }
});
