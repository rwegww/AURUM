import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../constants/theme";

export default function PlacementAssessmentModal({
  assessment,
  visible,
  onClose,
  onSubmit,
  onPassed,
  onFailed
}) {
  const [answers, setAnswers] = React.useState({});
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    if (!assessment) return;
    setAnswers({});
    setQuestionIndex(0);
    setSubmitting(false);
    setError("");
    setResult(null);
  }, [assessment?.attemptId]);

  const questions = assessment?.questions || [];
  const question = questions[questionIndex];
  const selectedAnswer = question ? answers[question.id] : undefined;
  const answeredCount = questions.filter((item) => Number.isInteger(answers[item.id])).length;

  const moveNext = async () => {
    if (!question || !Number.isInteger(selectedAnswer)) {
      setError("Hãy chọn một đáp án trước khi tiếp tục.");
      return;
    }
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      setError("");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const response = await onSubmit({ attemptId: assessment.attemptId, answers });
      setResult(response?.result || null);
    } catch (submitError) {
      setError(submitError.message || "Chưa thể chấm bài. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={result ? undefined : onClose}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <Ionicons name="school-outline" size={30} color="#ffffff" />
              </View>
              <View style={styles.headerCopy}>
                <Text style={styles.eyebrow}>Xếp lớp ban đầu</Text>
                <Text style={styles.title}>Bài đánh giá khối {assessment?.grade}</Text>
                <Text style={styles.subtitle}>Cần đạt từ {assessment?.passingPercent || 70}% để xác nhận khối.</Text>
              </View>
              {!result ? (
                <Pressable onPress={onClose} style={styles.closeButton} accessibilityLabel="Đóng bài đánh giá">
                  <Ionicons name="close" size={22} color="#ffffff" />
                </Pressable>
              ) : null}
            </View>

            {!result && question ? (
              <View style={styles.body}>
                <View style={styles.progressRow}>
                  <View style={styles.progressPill}>
                    <Text style={styles.progressPillText}>Câu {questionIndex + 1}/{questions.length}</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${((questionIndex + 1) / questions.length) * 100}%` }]} />
                  </View>
                </View>

                <Text style={styles.question}>{question.question}</Text>
                <View style={styles.optionStack}>
                  {(question.options || []).map((option, index) => {
                    const selected = selectedAnswer === index;
                    return (
                      <Pressable
                        key={`${index}-${option}`}
                        onPress={() => {
                          setAnswers((current) => ({ ...current, [question.id]: index }));
                          setError("");
                        }}
                        style={[styles.option, selected ? styles.optionSelected : null]}
                      >
                        <View style={[styles.optionLetter, selected ? styles.optionLetterSelected : null]}>
                          <Text style={[styles.optionLetterText, selected ? styles.optionLetterTextSelected : null]}>
                            {String.fromCharCode(65 + index)}
                          </Text>
                        </View>
                        <Text style={[styles.optionText, selected ? styles.optionTextSelected : null]}>{option}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.actions}>
                  <Pressable
                    disabled={questionIndex === 0 || submitting}
                    onPress={() => setQuestionIndex((current) => Math.max(0, current - 1))}
                    style={[styles.backButton, questionIndex === 0 ? styles.disabled : null]}
                  >
                    <Ionicons name="arrow-back" size={18} color={colors.muted} />
                    <Text style={styles.backButtonText}>Quay lại</Text>
                  </Pressable>
                  <Pressable disabled={submitting} onPress={moveNext} style={styles.nextButton}>
                    {submitting ? <ActivityIndicator color="#ffffff" /> : (
                      <>
                        <Text style={styles.nextButtonText}>{questionIndex === questions.length - 1 ? "Nộp bài" : "Tiếp tục"}</Text>
                        <Ionicons name="arrow-forward" size={19} color="#ffffff" />
                      </>
                    )}
                  </Pressable>
                </View>
                <Text style={styles.answerCount}>Đã trả lời {answeredCount}/{questions.length} câu · Kết quả được chấm trên máy chủ</Text>
              </View>
            ) : null}

            {result ? (
              <View style={styles.resultBody}>
                <View style={[styles.resultIcon, result.passed ? styles.resultIconPassed : styles.resultIconFailed]}>
                  <Ionicons name={result.passed ? "trophy" : "refresh"} size={42} color={result.passed ? "#b45309" : "#b42318"} />
                </View>
                <Text style={[styles.resultTitle, result.passed ? styles.resultTitlePassed : null]}>
                  {result.passed ? `Bạn đã được xếp vào khối ${result.grade}` : `Chưa phù hợp với khối ${result.grade}`}
                </Text>
                <Text style={styles.resultText}>
                  Bạn trả lời đúng {result.correct}/{result.total} câu ({result.percent}%). {result.passed
                    ? "Bài học đầu tiên đã sẵn sàng."
                    : `Hệ thống gợi ý thử khối ${result.recommendedGrade}.`}
                </Text>
                <Pressable onPress={() => result.passed ? onPassed(result) : onFailed(result)} style={[styles.resultButton, result.passed ? null : styles.resultButtonFailed]}>
                  <Text style={styles.resultButtonText}>{result.passed ? "Vào hành trình" : "Chọn lại khối"}</Text>
                  <Ionicons name={result.passed ? "arrow-forward" : "refresh"} size={20} color="#ffffff" />
                </Pressable>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0f172a" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: spacing.md },
  sheet: { backgroundColor: "#ffffff", borderRadius: 30, overflow: "hidden" },
  header: { alignItems: "center", backgroundColor: colors.green, flexDirection: "row", gap: 12, padding: 20 },
  headerIcon: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 16, height: 54, justifyContent: "center", width: 54 },
  headerCopy: { flex: 1 },
  eyebrow: { color: "rgba(255,255,255,0.72)", fontFamily: typography.bold, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" },
  title: { color: "#ffffff", fontFamily: typography.bold, fontSize: 21, lineHeight: 27, marginTop: 3 },
  subtitle: { color: "rgba(255,255,255,0.82)", fontFamily: typography.medium, fontSize: 12, lineHeight: 18, marginTop: 3 },
  closeButton: { alignItems: "center", backgroundColor: "rgba(0,0,0,0.12)", borderRadius: 18, height: 36, justifyContent: "center", width: 36 },
  body: { gap: 20, padding: 22 },
  progressRow: { alignItems: "center", flexDirection: "row", gap: 14, justifyContent: "space-between" },
  progressPill: { backgroundColor: "#ecfdf3", borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8 },
  progressPillText: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" },
  progressTrack: { backgroundColor: "#f1f5f9", borderRadius: 999, flex: 1, height: 8, overflow: "hidden" },
  progressFill: { backgroundColor: colors.green, borderRadius: 999, height: "100%" },
  question: { color: "#0f172a", fontFamily: typography.bold, fontSize: 21, lineHeight: 30 },
  optionStack: { gap: 10 },
  option: { alignItems: "center", backgroundColor: "#ffffff", borderColor: "#eef2f6", borderRadius: 18, borderWidth: 2, flexDirection: "row", gap: 12, minHeight: 62, padding: 12 },
  optionSelected: { backgroundColor: "#ecfdf3", borderColor: colors.green },
  optionLetter: { alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 16, height: 34, justifyContent: "center", width: 34 },
  optionLetterSelected: { backgroundColor: colors.green },
  optionLetterText: { color: "#64748b", fontFamily: typography.bold, fontSize: 13 },
  optionLetterTextSelected: { color: "#ffffff" },
  optionText: { color: "#334155", flex: 1, fontFamily: typography.bold, fontSize: 14, lineHeight: 20 },
  optionTextSelected: { color: "#14532d" },
  error: { color: "#b42318", fontFamily: typography.bold, fontSize: 13 },
  actions: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  backButton: { alignItems: "center", flexDirection: "row", gap: 6, minHeight: 48, paddingHorizontal: 8 },
  backButtonText: { color: colors.muted, fontFamily: typography.bold, fontSize: 13 },
  disabled: { opacity: 0.3 },
  nextButton: { alignItems: "center", backgroundColor: colors.green, borderBottomColor: colors.greenDark, borderBottomWidth: 4, borderRadius: 16, flexDirection: "row", gap: 8, minHeight: 52, minWidth: 144, justifyContent: "center", paddingHorizontal: 18 },
  nextButtonText: { color: "#ffffff", fontFamily: typography.bold, fontSize: 14 },
  answerCount: { color: "#94a3b8", fontFamily: typography.medium, fontSize: 11, lineHeight: 17, textAlign: "center" },
  resultBody: { alignItems: "center", gap: 12, padding: 28 },
  resultIcon: { alignItems: "center", borderRadius: 24, height: 78, justifyContent: "center", width: 78 },
  resultIconPassed: { backgroundColor: "#fef3c7" },
  resultIconFailed: { backgroundColor: "#fee2e2" },
  resultTitle: { color: "#0f172a", fontFamily: typography.bold, fontSize: 27, lineHeight: 34, textAlign: "center" },
  resultTitlePassed: { color: "#15803d" },
  resultText: { color: "#64748b", fontFamily: typography.medium, fontSize: 15, lineHeight: 23, textAlign: "center" },
  resultButton: { alignItems: "center", alignSelf: "stretch", backgroundColor: colors.green, borderRadius: 16, flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 10, minHeight: 54 },
  resultButtonFailed: { backgroundColor: "#0f172a" },
  resultButtonText: { color: "#ffffff", fontFamily: typography.bold, fontSize: 15 }
});
