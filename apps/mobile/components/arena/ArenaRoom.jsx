import React from "react";
import { AppState, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, GhostButton, Pill, PrimaryButton, ProgressBar, TextField } from "../ui/Primitives";
import { colors, radius, spacing, typography } from "../../constants/theme";
import { arenaApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
const roomStatusLabel = (status) => {
  if (status === "waiting") return "Đang chờ chủ phòng";
  if (status === "playing") return "Đang thi đấu";
  if (status === "finished") return "Đã kết thúc";
  return "Đang cập nhật";
};

const questionTypeLabel = (type) => {
  if (type === "calculation") return "Tính toán";
  if (type === "balancing") return "Cân bằng phương trình";
  if (type === "atom_match") return "Ghép nguyên tử";
  if (type === "electron_match") return "Cấu hình electron";
  return "Câu hỏi";
};

const getRemainingSeconds = (endsAt, now = Date.now()) => {
  if (!endsAt) return 0;
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - now) / 1000));
};

const parseNumber = (value) => Number(String(value).trim().replace(",", "."));

const NumericStepper = ({ value, onChange, min = 0, max = 12, disabled }) => (
  <View style={styles.stepper}>
    <Pressable
      disabled={disabled || value <= min}
      onPress={() => onChange(value - 1)}
      style={[styles.stepperButton, disabled || value <= min ? styles.controlDisabled : null]}
    >
      <Ionicons name="remove" size={18} color={colors.ink} />
    </Pressable>
    <Text style={styles.stepperValue}>{value}</Text>
    <Pressable
      disabled={disabled || value >= max}
      onPress={() => onChange(value + 1)}
      style={[styles.stepperButton, disabled || value >= max ? styles.controlDisabled : null]}
    >
      <Ionicons name="add" size={18} color={colors.ink} />
    </Pressable>
  </View>
);

const SubmitButton = ({ onPress, disabled, submitting }) => (
  <PrimaryButton
    label={submitting ? "Đang nộp..." : "Chốt đáp án"}
    icon={submitting ? "sync-outline" : "send-outline"}
    color={colors.green}
    onPress={onPress}
    disabled={disabled || submitting}
  />
);

const CalculationAnswer = ({ question, disabled, submitting, onSubmit }) => {
  const [value, setValue] = React.useState("");
  const payload = question.payload || {};
  const parsed = parseNumber(value);

  return (
    <View style={styles.answerStack}>
      {(payload.given || []).length ? (
        <View style={styles.givenGrid}>
          {payload.given.map((item, index) => (
            <View key={`${item.label}-${index}`} style={styles.givenItem}>
              <Text style={styles.givenLabel}>{item.label}</Text>
              <Text style={styles.givenValue}>{item.value} {item.unit || ""}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {payload.formula ? (
        <View style={styles.formulaBox}>
          <Text style={styles.formulaLabel}>Công thức gợi ý</Text>
          <Text style={styles.formulaText}>{payload.formula}</Text>
        </View>
      ) : null}
      <TextField
        icon="calculator-outline"
        value={value}
        onChangeText={setValue}
        keyboardType="decimal-pad"
        editable={!disabled && !submitting}
        placeholder={`${payload.target?.label || "Kết quả"}${payload.target?.unit ? ` (${payload.target.unit})` : ""}`}
      />
      <SubmitButton onPress={() => onSubmit({ gameType: "calculation", value: parsed })} disabled={!Number.isFinite(parsed) || disabled} submitting={submitting} />
    </View>
  );
};

const BalancingAnswer = ({ question, disabled, submitting, onSubmit }) => {
  const equation = question.payload?.equation || { reactants: [], products: [] };
  const formulas = [...(equation.reactants || []), ...(equation.products || [])];
  const [coefficients, setCoefficients] = React.useState(() => formulas.map(() => 1));
  const min = Number(question.payload?.minCoefficient || 1);
  const max = Number(question.payload?.maxCoefficient || 12);
  const reactantsLength = equation.reactants?.length || 0;

  if (!formulas.length) {
    return <Text style={styles.unsupportedText}>Câu hỏi cân bằng này thiếu dữ liệu phương trình. Hãy làm mới phòng để nhận câu khác.</Text>;
  }

  return (
    <View style={styles.answerStack}>
      <Text style={styles.helperText}>Điều chỉnh hệ số ở từng chất để cân bằng phương trình.</Text>
      <View style={styles.coefficientStack}>
        {formulas.map((formula, index) => (
          <View key={`${formula}-${index}`} style={styles.coefficientRow}>
            <Text style={styles.equationSide}>{index < reactantsLength ? "Vế trái" : "Vế phải"}</Text>
            <Text style={styles.formulaName}>{formula}</Text>
            <NumericStepper
              value={coefficients[index]}
              min={min}
              max={max}
              disabled={disabled || submitting}
              onChange={(nextValue) => setCoefficients((current) => current.map((value, itemIndex) => itemIndex === index ? nextValue : value))}
            />
          </View>
        ))}
      </View>
      <SubmitButton onPress={() => onSubmit({ gameType: "balancing", value: coefficients })} disabled={disabled} submitting={submitting} />
    </View>
  );
};

const AtomMatchAnswer = ({ question, disabled, submitting, onSubmit }) => {
  const payload = question.payload || {};
  const slots = payload.slots || [];
  const choices = payload.choices || [];
  const [placements, setPlacements] = React.useState({});

  if (!slots.length) {
    return <Text style={styles.unsupportedText}>Câu ghép nguyên tử này thiếu vị trí cần ghép. Hãy làm mới phòng để nhận câu khác.</Text>;
  }

  return (
    <View style={styles.answerStack}>
      <Text style={styles.helperText}>Điền kí hiệu nguyên tử vào từng vị trí. Đáp án được chấm trên máy chủ.</Text>
      {choices.length ? (
        <View style={styles.choiceRow}>
          {choices.map((choice) => (
            <Pill key={choice.symbol} label={`${choice.symbol}${choice.name ? ` · ${choice.name}` : ""}`} color={colors.green} />
          ))}
        </View>
      ) : null}
      <View style={styles.slotStack}>
        {slots.map((slot, index) => (
          <View key={slot.id || index} style={styles.slotRow}>
            <View style={styles.slotCopy}>
              <Text style={styles.slotLabel}>{slot.label || `Vị trí ${index + 1}`}</Text>
              {slot.hint ? <Text style={styles.slotHint}>{slot.hint}</Text> : null}
            </View>
            <TextInput
              value={placements[slot.id] || ""}
              onChangeText={(value) => setPlacements((current) => ({ ...current, [slot.id]: value.trim() }))}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!disabled && !submitting}
              placeholder="H"
              placeholderTextColor="#98a2b3"
              style={styles.atomInput}
            />
          </View>
        ))}
      </View>
      <SubmitButton
        onPress={() => onSubmit({ gameType: "atom_match", value: placements })}
        disabled={disabled || !slots.every((slot) => String(placements[slot.id] || "").trim())}
        submitting={submitting}
      />
    </View>
  );
};

const ElectronMatchAnswer = ({ question, disabled, submitting, onSubmit }) => {
  const payload = question.payload || {};
  const labels = payload.shellLabels || [];
  const target = Number(payload.atomicNumber || 0);
  const [shells, setShells] = React.useState(() => labels.map(() => 0));
  const total = shells.reduce((sum, item) => sum + item, 0);

  if (!labels.length || !target) {
    return <Text style={styles.unsupportedText}>Câu cấu hình electron này thiếu dữ liệu lớp electron. Hãy làm mới phòng để nhận câu khác.</Text>;
  }

  return (
    <View style={styles.answerStack}>
      <Text style={styles.helperText}>Nguyên tử {payload.symbol || ""} có Z = {target}. Phân bổ electron vào các lớp.</Text>
      <View style={styles.coefficientStack}>
        {labels.map((label, index) => {
          const capacity = 2 * (index + 1) * (index + 1);
          return (
            <View key={label} style={styles.coefficientRow}>
              <View style={styles.slotCopy}>
                <Text style={styles.slotLabel}>Lớp {label}</Text>
                <Text style={styles.slotHint}>Tối đa {capacity} e</Text>
              </View>
              <NumericStepper
                value={shells[index]}
                min={0}
                max={capacity}
                disabled={disabled || submitting}
                onChange={(nextValue) => setShells((current) => current.map((value, itemIndex) => itemIndex === index ? nextValue : value))}
              />
            </View>
          );
        })}
      </View>
      <Pill label={`Tổng electron: ${total}/${target}`} color={total === target ? colors.green : colors.amber} />
      <SubmitButton onPress={() => onSubmit({ gameType: "electron_match", value: shells })} disabled={disabled || total !== target} submitting={submitting} />
    </View>
  );
};

const ArenaAnswer = ({ question, disabled, submitting, onSubmit }) => {
  if (question.gameType === "calculation") return <CalculationAnswer question={question} disabled={disabled} submitting={submitting} onSubmit={onSubmit} />;
  if (question.gameType === "balancing") return <BalancingAnswer question={question} disabled={disabled} submitting={submitting} onSubmit={onSubmit} />;
  if (question.gameType === "atom_match") return <AtomMatchAnswer question={question} disabled={disabled} submitting={submitting} onSubmit={onSubmit} />;
  if (question.gameType === "electron_match") return <ElectronMatchAnswer question={question} disabled={disabled} submitting={submitting} onSubmit={onSubmit} />;
  return <Text style={styles.unsupportedText}>Phiên bản mobile chưa hỗ trợ loại câu hỏi này.</Text>;
};

export default function ArenaRoom({ token, roomId, initialState, onLeave, onStateChange }) {
  const { user } = useAuth();
  const [state, setState] = React.useState(initialState || null);
  const [syncing, setSyncing] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState(null);
  const [now, setNow] = React.useState(Date.now());
  const requestRef = React.useRef(0);
  const mountedRef = React.useRef(true);

  const syncState = React.useCallback(async ({ silent = false } = {}) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    if (!silent) setSyncing(true);
    try {
      const response = await arenaApi.roomState(token, roomId);
      const nextState = response?.state;
      if (!nextState?.room || String(nextState.room.id) !== String(roomId)) {
        throw new Error("Máy chủ trả về trạng thái của phòng khác.");
      }
      if (!mountedRef.current || requestId !== requestRef.current) return null;
      setState(nextState);
      onStateChange?.(nextState);
      return nextState;
    } catch (error) {
      if (!silent && mountedRef.current) setFeedback({ type: "error", message: error.message });
      return null;
    } finally {
      if (!silent && mountedRef.current && requestId === requestRef.current) setSyncing(false);
    }
  }, [onStateChange, roomId, token]);

  React.useEffect(() => {
    mountedRef.current = true;
    let intervalId;
    const poll = () => syncState({ silent: true });
    const appStateSubscription = AppState.addEventListener("change", (nextStatus) => {
      if (nextStatus === "active") poll();
    });

    poll();
    intervalId = setInterval(poll, 2000);
    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
      clearInterval(intervalId);
      appStateSubscription.remove();
    };
  }, [syncState]);

  React.useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const submitAnswer = async (payload) => {
    if (submitting || state?.room?.status !== "playing") return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const response = await arenaApi.answerRoom(token, roomId, payload);
      if (response?.state) {
        setState(response.state);
        onStateChange?.(response.state);
      }
      setFeedback({
        type: response?.isCorrect ? "success" : "error",
        message: response?.isCorrect ? `Chính xác, +${response.scoreAwarded || 0} điểm.` : "Chưa chính xác. Hãy chờ vòng tiếp theo để thử lại."
      });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const room = state?.room || initialState?.room;
  const players = state?.players || initialState?.players || [];
  const question = state?.currentQuestion;
  const hasAnswered = (state?.myAnswers || []).some((answer) => answer.round_index === room?.current_round_index);
  const currentPlayer = players.find((player) => player.nguoi_dung_id === user?.id);
  const isSpectator = user?.role === "teacher" && !currentPlayer;
  const remainingSeconds = getRemainingSeconds(room?.round_ends_at, now);
  const timeLimit = question?.timeLimitSeconds || 45;
  const timerProgress = room?.status === "playing" ? remainingSeconds / timeLimit : 0;

  return (
    <View style={styles.stack}>
      <Card accent={room?.status === "playing" ? colors.green : colors.amber} style={styles.roomCard}>
        <View style={styles.roomTop}>
          <View style={styles.roomTitleWrap}>
            <Text style={styles.roomTitle}>{room?.name || `Phòng ${roomId}`}</Text>
            <Text style={styles.roomMeta}>Vòng {(room?.current_round_index || 0) + 1}/{room?.total_rounds || 10} · {roomStatusLabel(room?.status)}</Text>
          </View>
          <Pill label={roomId} color={room?.status === "playing" ? colors.green : colors.amber} />
        </View>

        {room?.status === "playing" ? (
          <View style={styles.timerBox}>
            <View style={styles.timerTop}>
              <Text style={styles.timerLabel}>Thời gian còn lại</Text>
              <Text style={[styles.timerValue, remainingSeconds <= 8 ? styles.timerUrgent : null]}>{remainingSeconds}s</Text>
            </View>
            <ProgressBar value={timerProgress} color={remainingSeconds <= 8 ? colors.red : colors.green} />
          </View>
        ) : null}

        <View style={styles.playerStack}>
          {players.map((player) => (
            <View key={player.nguoi_dung_id} style={styles.playerRow}>
              <View style={styles.playerAvatar}><Text style={styles.playerAvatarText}>{String(player.username || "A").slice(0, 1).toUpperCase()}</Text></View>
              <View style={styles.playerCopy}>
                <Text style={styles.playerName}>{player.username}</Text>
                <Text style={styles.playerMeta}>{player.correct_count || 0} câu đúng</Text>
              </View>
              <Text style={styles.playerScore}>{player.score || 0}</Text>
            </View>
          ))}
        </View>

        <View style={styles.roomActions}>
          <GhostButton label={syncing ? "Đang đồng bộ" : "Đồng bộ"} icon="refresh-outline" color={colors.green} onPress={() => syncState()} disabled={syncing} style={styles.actionButton} />
          <GhostButton label="Rời phòng" icon="exit-outline" color={colors.red} onPress={onLeave} style={styles.actionButton} />
        </View>
      </Card>

      {room?.status === "waiting" ? (
        <Card style={styles.waitingCard}>
          <Ionicons name="people-outline" size={28} color={colors.amber} />
          <Text style={styles.waitingTitle}>Bạn đã vào phòng</Text>
          <Text style={styles.waitingText}>Màn hình này tự đồng bộ mỗi 2 giây. Khi chủ phòng trên PC bắt đầu, câu hỏi sẽ tự hiện tại đây.</Text>
        </Card>
      ) : null}

      {room?.status === "playing" && question && !isSpectator ? (
        <Card accent={colors.green} style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Pill label={questionTypeLabel(question.gameType)} color={colors.green} icon="flask-outline" />
            {hasAnswered ? <Pill label="Đã chốt đáp án" color={colors.green} icon="checkmark-outline" /> : null}
          </View>
          <Text style={styles.questionText}>{question.question}</Text>
          <ArenaAnswer key={question.id} question={question} disabled={hasAnswered || remainingSeconds <= 0} submitting={submitting} onSubmit={submitAnswer} />
        </Card>
      ) : null}

      {room?.status === "playing" && isSpectator ? (
        <Card accent={colors.green} style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Pill label="Bảng điều khiển" color={colors.green} icon="eye-outline" />
          </View>
          <Text style={styles.questionText}>Bạn đang quan sát phòng đấu với tư cách là Giáo viên. Theo dõi điểm số ở danh sách bên trên nhé!</Text>
        </Card>
      ) : null}

      {room?.status === "finished" ? (
        <Card accent={colors.green} style={styles.finishedCard}>
          <Ionicons name="trophy-outline" size={30} color={colors.green} />
          <Text style={styles.waitingTitle}>Trận đấu đã kết thúc</Text>
          <Text style={styles.waitingText}>Điểm và lịch sử trận được lưu trên máy chủ. Bạn có thể rời phòng để xem lại bảng đấu.</Text>
        </Card>
      ) : null}

      {feedback ? <Text style={[styles.feedback, feedback.type === "success" ? styles.feedbackSuccess : styles.feedbackError]}>{feedback.message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.md },
  roomCard: { gap: spacing.md },
  roomTop: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm, alignItems: "flex-start" },
  roomTitleWrap: { flex: 1, gap: 4 },
  roomTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 19, lineHeight: 25 },
  roomMeta: { color: colors.muted, fontFamily: typography.medium, fontSize: 13, lineHeight: 19 },
  timerBox: { gap: 7, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, padding: spacing.md },
  timerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  timerLabel: { color: colors.muted, fontFamily: typography.bold, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 },
  timerValue: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 18 },
  timerUrgent: { color: colors.red },
  playerStack: { gap: 8 },
  playerRow: { alignItems: "center", backgroundColor: colors.surfaceAlt, borderRadius: radius.md, flexDirection: "row", gap: spacing.sm, padding: 10 },
  playerAvatar: { alignItems: "center", backgroundColor: colors.green, borderRadius: 16, height: 32, justifyContent: "center", width: 32 },
  playerAvatarText: { color: "#fff", fontFamily: typography.bold, fontSize: 14 },
  playerCopy: { flex: 1, gap: 2 },
  playerName: { color: colors.ink, fontFamily: typography.bold, fontSize: 14 },
  playerMeta: { color: colors.muted, fontFamily: typography.medium, fontSize: 11 },
  playerScore: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 18 },
  roomActions: { flexDirection: "row", gap: spacing.sm },
  actionButton: { flex: 1, minHeight: 44 },
  waitingCard: { alignItems: "center", backgroundColor: "#fff9e8", borderColor: "#f4d58d", gap: 8, paddingVertical: spacing.lg },
  waitingTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 18, textAlign: "center" },
  waitingText: { color: colors.muted, fontFamily: typography.medium, fontSize: 14, lineHeight: 21, textAlign: "center" },
  questionCard: { gap: spacing.md },
  questionHeader: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  questionText: { color: colors.ink, fontFamily: typography.bold, fontSize: 17, lineHeight: 25 },
  answerStack: { gap: spacing.md },
  helperText: { color: colors.muted, fontFamily: typography.medium, fontSize: 13, lineHeight: 20 },
  givenGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  givenItem: { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm, gap: 3, minWidth: 104, padding: 10 },
  givenLabel: { color: colors.muted, fontFamily: typography.bold, fontSize: 11 },
  givenValue: { color: colors.ink, fontFamily: typography.bold, fontSize: 15 },
  formulaBox: { backgroundColor: "#edf7e5", borderColor: "#b9dca0", borderRadius: radius.md, borderWidth: 1, gap: 4, padding: spacing.md },
  formulaLabel: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 11, textTransform: "uppercase" },
  formulaText: { color: colors.ink, fontFamily: typography.bold, fontSize: 16, lineHeight: 23 },
  coefficientStack: { gap: 8 },
  coefficientRow: { alignItems: "center", backgroundColor: colors.surfaceAlt, borderRadius: radius.md, flexDirection: "row", gap: spacing.sm, padding: 10 },
  equationSide: { color: colors.muted, fontFamily: typography.bold, fontSize: 10, position: "absolute", right: 10, top: 4, textTransform: "uppercase" },
  formulaName: { color: colors.ink, flex: 1, fontFamily: typography.bold, fontSize: 16, paddingTop: 6 },
  stepper: { alignItems: "center", flexDirection: "row", gap: 6 },
  stepperButton: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 11, borderWidth: 1, height: 34, justifyContent: "center", width: 34 },
  stepperValue: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 18, minWidth: 26, textAlign: "center" },
  controlDisabled: { opacity: 0.4 },
  choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  slotStack: { gap: 8 },
  slotRow: { alignItems: "center", backgroundColor: colors.surfaceAlt, borderRadius: radius.md, flexDirection: "row", gap: spacing.sm, padding: 10 },
  slotCopy: { flex: 1, gap: 2 },
  slotLabel: { color: colors.ink, fontFamily: typography.bold, fontSize: 14 },
  slotHint: { color: colors.muted, fontFamily: typography.medium, fontSize: 11 },
  atomInput: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 11, borderWidth: 1, color: colors.ink, fontFamily: typography.bold, fontSize: 16, height: 42, paddingHorizontal: 10, textAlign: "center", width: 64 },
  unsupportedText: { color: colors.red, fontFamily: typography.medium, fontSize: 13, lineHeight: 20 },
  finishedCard: { alignItems: "center", gap: 8, paddingVertical: spacing.lg },
  feedback: { borderRadius: radius.md, fontFamily: typography.bold, fontSize: 13, lineHeight: 20, padding: spacing.md },
  feedbackSuccess: { backgroundColor: "#eaf6df", color: colors.greenDark },
  feedbackError: { backgroundColor: "#fff0f0", color: "#b42318" }
});
