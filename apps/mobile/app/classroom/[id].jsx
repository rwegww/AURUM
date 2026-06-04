import React from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Card,
  EmptyState,
  GhostButton,
  IconButton,
  ListRow,
  LoadingState,
  Pill,
  PrimaryButton,
  ProgressBar,
  Screen,
  ScreenHeader,
  SectionTitle
} from "../../components/ui/Primitives";
import { colors, radius, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { classApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";

const postColor = (type) => {
  if (type === "assignment") return colors.green;
  if (type === "video") return colors.green;
  return colors.green;
};

const postIcon = (type) => {
  if (type === "assignment") return "clipboard-outline";
  if (type === "video") return "play-circle-outline";
  return "megaphone-outline";
};

const postTypeLabel = (type) => {
  if (type === "assignment") return "Bài tập";
  if (type === "video") return "Video";
  return "Bài đăng";
};

const questionTitle = (part) => {
  if (part === 1) return "Phần I - Trắc nghiệm";
  if (part === 2) return "Phần II - Đúng / Sai";
  if (part === 3) return "Phần III - Trả lời ngắn";
  return `Phần ${part || "bài làm"}`;
};

const normalizeOptions = (options) => {
  if (!options) return [];
  if (Array.isArray(options)) {
    return options.map((label, index) => ({ key: String(index), label }));
  }
  return Object.entries(options).map(([key, label]) => ({ key, label }));
};

const isAnswered = (question, answer) => {
  const type = question.type || "multiple_choice";
  if (type === "multiple_choice") return answer !== undefined && answer !== null;
  if (type === "true_false") {
    const optionKeys = normalizeOptions(question.options).map((item) => item.key);
    return optionKeys.length > 0 && optionKeys.every((key) => answer?.[key] !== undefined);
  }
  return typeof answer === "string" && answer.trim().length > 0;
};

const calculateScore = (questions, answers) => {
  const multipleChoiceQuestions = questions.filter((q) => (q.type || "multiple_choice") === "multiple_choice");
  if (multipleChoiceQuestions.length === 0) return null;

  let correctCount = 0;
  questions.forEach((question, index) => {
    if ((question.type || "multiple_choice") !== "multiple_choice") return;
    const expectedIndex = Number.isInteger(question.correct_index)
      ? question.correct_index
      : ["A", "B", "C", "D"].indexOf(String(question.correct_answer || "").toUpperCase());
    if (expectedIndex >= 0 && answers[index] === expectedIndex) correctCount += 1;
  });

  return Math.round((correctCount / multipleChoiceQuestions.length) * 10);
};

export default function ClassroomDetailScreen() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const [submittingPostId, setSubmittingPostId] = React.useState(null);
  const [activeAssignment, setActiveAssignment] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const classId = Array.isArray(id) ? id[0] : id;

  const resource = useApiResource(async () => {
    const [lop, posts, schedules] = await Promise.all([
      classApi.list(token).catch(() => []),
      classApi.posts(token, classId).catch(() => []),
      classApi.schedules(token, classId).catch(() => [])
    ]);
    const currentClass = lop.find(c => c.id === classId);
    return { currentClass, posts, schedules };
  }, [classId, token]);

  const openAssignment = (post) => {
    setActiveAssignment(post);
    setAnswers({});
  };

  const closeAssignment = () => {
    setActiveAssignment(null);
    setAnswers({});
  };

  const submitAssignment = async (post, payload = {}, showSuccess = true) => {
    setSubmittingPostId(post.id);
    try {
      await classApi.submitAssignment(token, post.id, payload);
      if (showSuccess) Alert.alert("Đã nộp bài", "Bài làm của bạn đã được ghi nhận.");
      closeAssignment();
      await resource.reload();
    } catch (error) {
      Alert.alert("Không nộp được", error.message);
    } finally {
      setSubmittingPostId(null);
    }
  };

  const submitQuiz = async () => {
    if (!activeAssignment) return;
    const questions = activeAssignment.questions || [];
    const score = calculateScore(questions, answers);
    const hasWrittenAnswer = questions.some((q) => q.type === "short_answer" || q.type === "essay" || q.type === "true_false");
    await submitAssignment(activeAssignment, { answers, score }, false);
    if (hasWrittenAnswer && score !== null) {
      Alert.alert("Đã gửi bài", `Phần trắc nghiệm: ${score}/10 điểm. Phần tự luận sẽ được giáo viên chấm riêng.`);
    } else if (score !== null) {
      Alert.alert("Đã gửi bài", `Điểm tự chấm: ${score}/10.`);
    } else {
      Alert.alert("Đã gửi bài", "Bài làm đã được gửi cho giáo viên chấm.");
    }
  };

  if (resource.loading && !resource.data) {
    return <LoadingState label="Đang tải lớp học..." />;
  }

  if (activeAssignment) {
    const questions = activeAssignment.questions || [];
    const answeredCount = questions.filter((question, index) => isAnswered(question, answers[index])).length;
    const canSubmit = answeredCount === questions.length && questions.length > 0;

    return (
      <Screen>
        <ScreenHeader
          eyebrow="Bài tập trực tuyến"
          title={activeAssignment.content}
          subtitle={`${answeredCount}/${questions.length} câu đã làm`}
          right={<IconButton icon="close-outline" onPress={closeAssignment} />}
        />

        <Card style={styles.quizSummary} accent={colors.green}>
          <View style={styles.quizSummaryTop}>
            <Pill label={`${questions.length} câu hỏi`} icon="help-circle-outline" color={colors.green} />
            {activeAssignment.deadline ? (
              <Pill label={`Hạn: ${new Date(activeAssignment.deadline).toLocaleString()}`} icon="time-outline" color={colors.red} />
            ) : null}
          </View>
          <ProgressBar value={questions.length ? answeredCount / questions.length : 0} color={colors.green} />
        </Card>

        <View style={styles.stack}>
          {questions.map((question, questionIndex) => {
            const type = question.type || "multiple_choice";
            const options = normalizeOptions(question.options);
            const showPartTitle = questionIndex === 0 || questions[questionIndex - 1].part !== question.part;

            return (
              <React.Fragment key={question.id || questionIndex}>
                {showPartTitle ? <SectionTitle title={questionTitle(question.part)} /> : null}
                <Card style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <View style={styles.questionIndex}>
                      <Text style={styles.questionIndexText}>{questionIndex + 1}</Text>
                    </View>
                    <Text style={styles.questionText}>{question.question || question.content}</Text>
                  </View>

                  {type === "multiple_choice" ? (
                    <View style={styles.optionGrid}>
                      {options.map((option, optionIndex) => {
                        const selected = answers[questionIndex] === optionIndex;
                        return (
                          <Pressable
                            key={option.key}
                            onPress={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                            style={[styles.choiceButton, selected ? styles.choiceButtonSelected : null]}
                          >
                            <Text style={[styles.choiceBadge, selected ? styles.choiceBadgeSelected : null]}>
                              {String.fromCharCode(65 + optionIndex)}
                            </Text>
                            <Text style={[styles.choiceText, selected ? styles.choiceTextSelected : null]}>{option.label}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : type === "true_false" ? (
                    <View style={styles.trueFalseStack}>
                      {options.map((option) => (
                        <View key={option.key} style={styles.trueFalseRow}>
                          <Text style={styles.trueFalsePrompt}>{option.key.toUpperCase()}. {option.label}</Text>
                          <View style={styles.trueFalseActions}>
                            <Pressable
                              onPress={() => setAnswers((current) => ({
                                ...current,
                                [questionIndex]: { ...(current[questionIndex] || {}), [option.key]: true }
                              }))}
                              style={[
                                styles.toggleButton,
                                answers[questionIndex]?.[option.key] === true ? styles.toggleTrueSelected : null
                              ]}
                            >
                              <Text style={[
                                styles.toggleText,
                                answers[questionIndex]?.[option.key] === true ? styles.toggleTextSelected : null
                              ]}>Đúng</Text>
                            </Pressable>
                            <Pressable
                              onPress={() => setAnswers((current) => ({
                                ...current,
                                [questionIndex]: { ...(current[questionIndex] || {}), [option.key]: false }
                              }))}
                              style={[
                                styles.toggleButton,
                                answers[questionIndex]?.[option.key] === false ? styles.toggleFalseSelected : null
                              ]}
                            >
                              <Text style={[
                                styles.toggleText,
                                answers[questionIndex]?.[option.key] === false ? styles.toggleTextSelected : null
                              ]}>Sai</Text>
                            </Pressable>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <TextInput
                      value={answers[questionIndex] || ""}
                      onChangeText={(value) => setAnswers((current) => ({ ...current, [questionIndex]: value }))}
                      placeholder="Nhập câu trả lời của bạn..."
                      placeholderTextColor="#98a2b3"
                      multiline
                      textAlignVertical="top"
                      style={styles.answerInput}
                    />
                  )}
                </Card>
              </React.Fragment>
            );
          })}
        </View>

        <PrimaryButton
          label={submittingPostId === activeAssignment.id ? "Đang nộp..." : "Nộp bài"}
          icon="send-outline"
          color={colors.green}
          onPress={submitQuiz}
          disabled={!canSubmit || submittingPostId === activeAssignment.id}
        />
        <GhostButton label="Quay lại lớp" icon="arrow-back-outline" onPress={closeAssignment} />
      </Screen>
    );
  }

  const posts = resource.data?.posts || [];
  const schedules = resource.data?.schedules || [];
  const currentClass = resource.data?.currentClass;
  const className = currentClass ? currentClass.name : `Lớp ${classId}`;

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Lớp học"
        title={className}
        subtitle="Bài đăng, bài tập và lịch học từ lớp đã tham gia."
        color={colors.green}
        right={<IconButton icon="arrow-back-outline" onPress={() => router.back()} />}
      />

      <SectionTitle title="Lịch học" actionLabel="Tải lại" onAction={resource.reload} color={colors.green} />
      {schedules.length > 0 ? (
        <View style={styles.stack}>
          {schedules.map((item) => (
            <ListRow
              key={item.id}
              icon="calendar-outline"
              title={item.title}
              subtitle={`${new Date(item.start_time).toLocaleString()}${item.meet_url ? " · Có liên kết học" : ""}`}
              color={colors.green}
            />
          ))}
        </View>
      ) : (
        <EmptyState icon="calendar-outline" title="Chưa có lịch học" subtitle="Lịch học sẽ xuất hiện khi giáo viên tạo lịch." />
      )}

      <SectionTitle title="Bài đăng" color={colors.green} />
      {posts.length > 0 ? (
        <View style={styles.stack}>
          {posts.map((post) => {
            const isAssignment = post.type === "assignment";
            const completed = Boolean(post.is_completed || post.user_submission);
            const questions = post.questions || [];
            return (
              <Card key={post.id} accent={postColor(post.type)} style={styles.postCard}>
                <View style={styles.postTop}>
                  <Pill label={postTypeLabel(post.type)} icon={postIcon(post.type)} color={postColor(post.type)} />
                  {questions.length > 0 ? <Pill label={`${questions.length} câu`} icon="help-circle-outline" color={colors.green} /> : null}
                  {completed ? <Pill label="Đã nộp" icon="checkmark-outline" color={colors.green} /> : null}
                </View>
                <Text style={styles.postContent}>{post.content}</Text>
                {post.deadline ? (
                  <Text style={styles.postMeta}>Hạn nộp: {new Date(post.deadline).toLocaleString()}</Text>
                ) : null}
                {completed && post.user_submission?.score !== null && post.user_submission?.score !== undefined ? (
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreLabel}>Điểm bài trực tuyến</Text>
                    <Text style={styles.scoreValue}>{post.user_submission.score}/10</Text>
                  </View>
                ) : null}
                {post.media_url && !questions.length ? (
                  <GhostButton
                    label="Mở tài liệu bài tập"
                    icon="open-outline"
                    color={colors.green}
                    onPress={() => Linking.openURL(post.media_url)}
                  />
                ) : null}
                {isAssignment && !completed && questions.length > 0 ? (
                  <PrimaryButton
                    label={`Làm bài (${questions.length} câu)`}
                    icon="create-outline"
                    color={colors.green}
                    onPress={() => openAssignment(post)}
                  />
                ) : null}
                {isAssignment && !completed && questions.length === 0 ? (
                  <PrimaryButton
                    label={submittingPostId === post.id ? "Đang nộp..." : "Đánh dấu đã nộp"}
                    icon="send-outline"
                    color={colors.green}
                    onPress={() => submitAssignment(post, {
                      answers: {
                        source: "mobile",
                        submittedAt: new Date().toISOString()
                      },
                      score: null
                    })}
                    disabled={submittingPostId === post.id}
                  />
                ) : null}
              </Card>
            );
          })}
        </View>
      ) : (
        <EmptyState icon="chatbubbles-outline" title="Chưa có bài đăng" subtitle="Thông báo và bài tập của lớp sẽ xuất hiện ở đây." />
      )}

      <GhostButton label="Quay lại" icon="arrow-back-outline" color={colors.green} onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.sm
  },
  postCard: {
    gap: spacing.md
  },
  postTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  postContent: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "800"
  },
  postMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  scoreBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: `${colors.green}30`,
    backgroundColor: `${colors.green}10`,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  scoreLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  scoreValue: {
    color: colors.greenDark,
    fontSize: 20,
    fontWeight: "900"
  },
  quizSummary: {
    gap: spacing.md
  },
  quizSummaryTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  questionCard: {
    gap: spacing.md
  },
  questionHeader: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start"
  },
  questionIndex: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center"
  },
  questionIndexText: {
    color: "#ffffff",
    fontWeight: "900"
  },
  questionText: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "900"
  },
  optionGrid: {
    gap: spacing.sm
  },
  choiceButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    backgroundColor: colors.surface
  },
  choiceButtonSelected: {
    borderColor: colors.green,
    backgroundColor: `${colors.green}10`
  },
  choiceBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: colors.surfaceAlt,
    color: colors.muted,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "900"
  },
  choiceBadgeSelected: {
    backgroundColor: colors.green,
    color: "#ffffff"
  },
  choiceText: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800"
  },
  choiceTextSelected: {
    color: colors.green
  },
  trueFalseStack: {
    gap: spacing.sm
  },
  trueFalseRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface
  },
  trueFalsePrompt: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800"
  },
  trueFalseActions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  toggleButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center"
  },
  toggleTrueSelected: {
    backgroundColor: colors.green
  },
  toggleFalseSelected: {
    backgroundColor: colors.red
  },
  toggleText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  toggleTextSelected: {
    color: "#ffffff"
  },
  answerInput: {
    minHeight: 130,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.ink,
    backgroundColor: colors.surfaceAlt,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700"
  }
});
