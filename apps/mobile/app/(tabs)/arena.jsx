import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  EmptyState,
  ErrorState,
  GhostButton,
  ListRow,
  LoadingState,
  Metric,
  Pill,
  PrimaryButton,
  Screen,
  ScreenHeader,
  SectionTitle,
  TextField
} from "../../components/ui/Primitives";
import { colors, spacing, typography } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { arenaApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";
import ArenaRoom from "../../components/arena/ArenaRoom";

const battleResultLabel = (result) => {
  if (result === "win") return "Thắng";
  if (result === "lose") return "Thua";
  if (result === "draw") return "Hòa";
  return "Đã đấu";
};

const ActiveRoomScreen = ({ state, token, onLeave, onStateChange }) => (
  <Screen>
    <ScreenHeader
      eyebrow="Đang thi đấu"
      title={state?.room?.name || "Phòng Arena"}
      subtitle="Trạng thái được đồng bộ tự động. Tập trung vào câu hỏi hiện tại nhé."
      right={<Pill label={`${state?.room?.current_players || 0} người`} icon="people-outline" color={colors.green} />}
    />
    <ArenaRoom
      token={token}
      roomId={state?.room?.id}
      initialState={state}
      onStateChange={onStateChange}
      onLeave={onLeave}
    />
  </Screen>
);

export default function ArenaTab() {
  const { token, user, refreshProfile } = useAuth();
  const [roomCode, setRoomCode] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [joining, setJoining] = React.useState(false);
  const [activeState, setActiveState] = React.useState(null);
  const isModerator = user?.role === "teacher" || user?.role === "admin";

  const arenaResource = useApiResource(async () => {
    const [leaderboard, rooms, battles] = await Promise.all([
      arenaApi.leaderboard().catch(() => ({ leaderboard: [] })),
      arenaApi.rooms().catch(() => ({ rooms: [] })),
      token ? arenaApi.myBattles(token).catch(() => ({ battles: [] })) : { battles: [] }
    ]);
    return {
      leaderboard: leaderboard?.leaderboard || [],
      rooms: rooms?.rooms || [],
      battles: battles?.battles || []
    };
  }, [token]);

  const createPractice = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const created = await arenaApi.createRoom(token, {
        name: isModerator ? `${user?.username || "AURUM"} mở phòng` : `${user?.username || "AURUM"} luyện tập`,
        mode: "solo",
        difficulty: "auto",
        max_players: isModerator ? 2 : 1,
        is_practice: !isModerator
      });
      if (isModerator) {
        const waiting = await arenaApi.roomState(token, created.room.id);
        setActiveState(waiting.state);
      } else {
        const started = await arenaApi.startRoom(token, created.room.id);
        setActiveState(started.state);
      }
    } catch (error) {
      Alert.alert("Không tạo được phòng", error.message);
    } finally {
      setCreating(false);
    }
  };

  const joinRoom = async (id = roomCode) => {
    const normalizedRoomId = String(id ?? "").trim();
    if (!normalizedRoomId || joining) return;
    setJoining(true);
    try {
      const joined = await arenaApi.joinRoom(token, normalizedRoomId);
      const state = await arenaApi.roomState(token, joined.room?.id || normalizedRoomId);
      setActiveState(state.state);
      setRoomCode("");
      await arenaResource.reload();
    } catch (error) {
      Alert.alert("Không tham gia được", error.message);
    } finally {
      setJoining(false);
    }
  };

  const leaveActiveRoom = async () => {
    const roomId = activeState?.room?.id;
    const wasFinished = activeState?.room?.status === "finished";
    if (!roomId) return;
    setActiveState(null);
    try {
      await arenaApi.leaveRoom(token, roomId);
      await arenaResource.reload();
      if (wasFinished) await refreshProfile();
    } catch (error) {
      Alert.alert("Không rời phòng được", error.message);
    }
  };

  React.useEffect(() => {
    let active = true;
    if (!token) return () => { active = false; };

    arenaApi.activeRoom(token)
      .then(async (response) => {
        if (!active || !response?.room?.id) return;
        const current = await arenaApi.roomState(token, response.room.id);
        if (active && current?.state) setActiveState(current.state);
      })
      .catch(() => {
        // A stale room should not block the Arena lobby from opening.
      });

    return () => {
      active = false;
    };
  }, [token]);

  if (arenaResource.loading && !arenaResource.data) {
    return <LoadingState label="Đang tải đấu trường..." />;
  }

  if (activeState) {
    return <ActiveRoomScreen state={activeState} token={token} onStateChange={setActiveState} onLeave={leaveActiveRoom} />;
  }

  const leaderboard = arenaResource.data?.leaderboard || [];
  const rooms = arenaResource.data?.rooms || [];
  const battles = arenaResource.data?.battles || [];
  const stats = user?.arenaStats || {};
  const totalMatches = Number(stats.total || 0);
  const winRate = totalMatches ? Math.round((Number(stats.wins || 0) / totalMatches) * 100) : 0;

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Khu vực thi đấu"
        title="Đấu trường hóa học"
        subtitle="Học nhanh hơn qua những trận đấu ngắn, rõ ràng và có điểm thưởng."
        right={<Pill label={`${stats.points || 0} điểm`} icon="trophy-outline" color={colors.green} />}
      />

      {arenaResource.error ? <ErrorState message={arenaResource.error.message} onRetry={arenaResource.reload} /> : null}

      <Card accent={colors.green} style={styles.heroCard}>
        <View style={styles.heroGlow}><Ionicons name="flash" size={32} color="#d9f2bd" /></View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroEyebrow}>Bắt đầu trong vài giây</Text>
          <Text style={styles.heroTitle}>{isModerator ? "Mở phòng cho học sinh" : "Sẵn sàng thử sức?"}</Text>
          <Text style={styles.heroDescription}>{isModerator ? "Tạo phòng, chờ đủ người rồi theo dõi trận đấu với vai trò giáo viên." : "Chơi một mình để làm quen hoặc dùng mã phòng để đấu cùng bạn bè."}</Text>
        </View>
        <PrimaryButton
          label={creating ? "Đang chuẩn bị..." : isModerator ? "Tạo phòng đấu" : "Luyện tập ngay"}
          icon="play"
          color={colors.green}
          onPress={createPractice}
          disabled={creating}
          style={styles.heroButton}
        />
      </Card>

      <View style={styles.metricRow}>
        <Metric label="Trận đấu" value={totalMatches} icon="game-controller-outline" color={colors.green} />
        <Metric label="Tỉ lệ thắng" value={`${winRate}%`} icon="trending-up-outline" color={colors.blue} />
        <Metric label="Điểm" value={stats.points || 0} icon="trophy-outline" color={colors.amber} />
      </View>

      <Card style={styles.joinCard}>
        <View style={styles.sectionHeading}>
          <View style={[styles.sectionIcon, styles.joinIcon]}><Ionicons name="keypad-outline" size={18} color={colors.blue} /></View>
          <View style={styles.sectionHeadingCopy}>
            <Text style={styles.sectionTitle}>Vào phòng bằng mã</Text>
            <Text style={styles.sectionSubtitle}>Nhập mã 6 số do chủ phòng gửi cho bạn.</Text>
          </View>
        </View>
        <View style={styles.joinRow}>
          <TextField
            icon="keypad-outline"
            placeholder="Ví dụ: 123456"
            value={roomCode}
            onChangeText={(value) => setRoomCode(value.replace(/\D/g, "").slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.joinInput}
          />
          <PrimaryButton
            label={joining ? "..." : "Vào phòng"}
            icon="enter-outline"
            onPress={() => joinRoom()}
            color={colors.blue}
            disabled={joining || roomCode.trim().length < 4}
            style={styles.joinButton}
          />
        </View>
      </Card>

      <Card style={styles.guideCard}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionIcon}><Ionicons name="sparkles-outline" size={18} color={colors.green} /></View>
          <View style={styles.sectionHeadingCopy}>
            <Text style={styles.sectionTitle}>Chơi như thế nào?</Text>
            <Text style={styles.sectionSubtitle}>Một ván gồm 10 thử thách hóa học.</Text>
          </View>
        </View>
        <View style={styles.guideSteps}>
          {[
            ["1", "Chọn cách chơi", "Luyện tập một mình hoặc vào phòng bạn bè."],
            ["2", "Trả lời nhanh", "Mỗi câu có đồng hồ và điểm thưởng theo tốc độ."],
            ["3", "Nhận điểm", "Kết quả và điểm xếp hạng được lưu tự động."]
          ].map(([number, title, description]) => (
            <View key={number} style={styles.guideStep}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{number}</Text></View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>{title}</Text>
                <Text style={styles.stepDescription}>{description}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.sectionTitleRow}>
        <SectionTitle title="Phòng đang mở" actionLabel="Tải lại" onAction={arenaResource.reload} />
        <Text style={styles.sectionCount}>{rooms.length} phòng</Text>
      </View>
      {rooms.length > 0 ? (
        <View style={styles.stack}>
          {rooms.slice(0, 5).map((room) => {
            const currentPlayers = Number(room.current_players || 0);
            const maxPlayers = Number(room.max_players || 2);
            const isFull = currentPlayers >= maxPlayers;
            return (
              <Card key={room.id} style={styles.roomListCard}>
                <View style={styles.roomListTop}>
                  <View style={styles.roomListIcon}><Ionicons name="people-outline" size={21} color={colors.green} /></View>
                  <View style={styles.roomListCopy}>
                    <Text style={styles.roomListTitle} numberOfLines={1}>{room.name || `Phòng ${room.id}`}</Text>
                    <Text style={styles.roomListSubtitle} numberOfLines={1}>{room.host_name || "Chủ phòng"} · Mã {room.id}</Text>
                  </View>
                  <Pill label={`${currentPlayers}/${maxPlayers}`} color={isFull ? colors.amber : colors.green} />
                </View>
                <View style={styles.roomListMeta}>
                  <Text style={styles.roomMetaText}><Ionicons name="game-controller-outline" size={14} color={colors.muted} /> {room.mode === "solo" ? "Đối kháng 1v1" : room.mode}</Text>
                  <Text style={styles.roomMetaText}><Ionicons name="flask-outline" size={14} color={colors.muted} /> {room.difficulty === "auto" ? "Theo trình độ" : room.difficulty}</Text>
                </View>
                <GhostButton
                  label={isFull ? "Phòng đã đầy" : joining ? "Đang vào..." : "Vào phòng"}
                  icon={isFull ? "lock-closed-outline" : "enter-outline"}
                  color={isFull ? colors.muted : colors.green}
                  onPress={() => joinRoom(room.id)}
                  disabled={isFull || joining}
                  style={styles.roomJoinButton}
                />
              </Card>
            );
          })}
        </View>
      ) : (
        <EmptyState icon="people-outline" title="Chưa có phòng chờ" subtitle="Bạn có thể luyện tập ngay hoặc nhập mã phòng từ bạn bè." />
      )}

      <SectionTitle title="Bảng xếp hạng" />
      {leaderboard.length > 0 ? (
        <View style={styles.stack}>
          {leaderboard.slice(0, 3).map((item) => (
            <ListRow
              key={`${item.rank}-${item.name}`}
              icon={item.rank === 1 ? "medal-outline" : "trophy-outline"}
              title={`${item.rank}. ${item.name}`}
              subtitle={`${item.points} điểm · ${item.wins}/${item.total} trận thắng`}
              color={item.rank === 1 ? colors.amber : colors.green}
            />
          ))}
        </View>
      ) : (
        <EmptyState icon="trophy-outline" title="Bảng xếp hạng đang trống" subtitle="Hãy hoàn thành trận đầu tiên để xuất hiện trên bảng." />
      )}

      <SectionTitle title="Trận gần đây" />
      {battles.length > 0 ? (
        <View style={styles.stack}>
          {battles.map((battle) => {
            const pointsDelta = battle.diem_thay_doi ?? 0;
            return (
              <ListRow
                key={battle.id}
                icon={battle.result === "win" ? "arrow-up-circle-outline" : battle.result === "lose" ? "arrow-down-circle-outline" : "remove-circle-outline"}
                title={battle.opponent_name || "Đấu trường"}
                subtitle={`${battleResultLabel(battle.result)} · ${battle.score || 0} điểm`}
                color={battle.result === "win" ? colors.green : battle.result === "lose" ? colors.red : colors.amber}
                right={<Text style={[styles.pointsDelta, { color: pointsDelta >= 0 ? colors.greenDark : colors.red }]}>{pointsDelta > 0 ? "+" : ""}{pointsDelta}</Text>}
              />
            );
          })}
        </View>
      ) : (
        <EmptyState icon="time-outline" title="Chưa có lịch sử trận" subtitle="Kết quả sẽ xuất hiện sau khi bạn hoàn thành trận đấu." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: { backgroundColor: "#f2faea", gap: spacing.md, overflow: "hidden", paddingVertical: spacing.lg },
  heroGlow: { alignItems: "center", backgroundColor: colors.green, borderRadius: 18, height: 56, justifyContent: "center", width: 56 },
  heroCopy: { gap: 5 },
  heroEyebrow: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 12, letterSpacing: 0.7, textTransform: "uppercase" },
  heroTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 24, lineHeight: 30 },
  heroDescription: { color: colors.muted, fontFamily: typography.medium, fontSize: 14, lineHeight: 21 },
  heroButton: { alignSelf: "stretch" },
  metricRow: { flexDirection: "row", gap: spacing.sm },
  joinCard: { gap: spacing.md },
  sectionHeading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  sectionIcon: { alignItems: "center", backgroundColor: "#eaf6df", borderRadius: 13, height: 38, justifyContent: "center", width: 38 },
  joinIcon: { backgroundColor: "#e9f5ff" },
  sectionHeadingCopy: { flex: 1, gap: 3 },
  sectionTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 17 },
  sectionSubtitle: { color: colors.muted, fontFamily: typography.medium, fontSize: 13, lineHeight: 18 },
  joinRow: { flexDirection: "row", gap: spacing.sm },
  joinInput: { flex: 1 },
  joinButton: { minWidth: 112, paddingHorizontal: 10 },
  guideCard: { gap: spacing.md },
  guideSteps: { gap: spacing.md },
  guideStep: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  stepNumber: { alignItems: "center", backgroundColor: colors.green, borderRadius: 14, height: 28, justifyContent: "center", width: 28 },
  stepNumberText: { color: "#ffffff", fontFamily: typography.bold, fontSize: 13 },
  stepCopy: { flex: 1, gap: 2 },
  stepTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 14 },
  stepDescription: { color: colors.muted, fontFamily: typography.medium, fontSize: 13, lineHeight: 19 },
  sectionTitleRow: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between" },
  sectionCount: { color: colors.muted, fontFamily: typography.medium, fontSize: 12, marginBottom: 3 },
  stack: { gap: spacing.sm },
  roomListCard: { gap: spacing.sm, padding: spacing.md },
  roomListTop: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  roomListIcon: { alignItems: "center", backgroundColor: colors.surfaceAlt, borderRadius: 13, height: 42, justifyContent: "center", width: 42 },
  roomListCopy: { flex: 1, gap: 3 },
  roomListTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 15 },
  roomListSubtitle: { color: colors.muted, fontFamily: typography.medium, fontSize: 12 },
  roomListMeta: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, paddingLeft: 50 },
  roomMetaText: { color: colors.muted, fontFamily: typography.medium, fontSize: 12 },
  roomJoinButton: { minHeight: 44 },
  pointsDelta: { fontFamily: typography.bold, fontSize: 14 }
});
