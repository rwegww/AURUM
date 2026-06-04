import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
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
import { colors, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { arenaApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";

const roomStatusLabel = (status) => {
  if (status === "waiting") return "Đang chờ";
  if (status === "active") return "Đang đấu";
  if (status === "finished") return "Đã kết thúc";
  return "Chưa rõ trạng thái";
};

const battleResultLabel = (result) => {
  if (result === "win") return "Thắng";
  if (result === "lose") return "Thua";
  if (result === "draw") return "Hòa";
  return "Đã đấu";
};

const questionTypeLabel = (type) => {
  if (type === "calculation") return "Tính toán";
  if (type === "balancing") return "Cân bằng phương trình";
  if (type === "atom_match") return "Ghép nguyên tử";
  if (type === "electron_match") return "Cấu hình electron";
  if (type === "multiple_choice") return "Trắc nghiệm";
  return "Câu hỏi";
};

export default function ArenaTab() {
  const { token, user } = useAuth();
  const [roomCode, setRoomCode] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [joining, setJoining] = React.useState(false);
  const [activeState, setActiveState] = React.useState(null);

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
    setCreating(true);
    try {
      const created = await arenaApi.createRoom(token, {
        name: `${user?.username || "AURUM"} luyện tập`,
        mode: "solo",
        difficulty: "auto",
        max_players: 1,
        is_practice: true
      });
      const started = await arenaApi.startRoom(token, created.room.id);
      setActiveState(started.state);
    } catch (error) {
      Alert.alert("Không tạo được phòng", error.message);
    } finally {
      setCreating(false);
    }
  };

  const joinRoom = async (id = roomCode) => {
    if (!id.trim()) return;
    setJoining(true);
    try {
      const joined = await arenaApi.joinRoom(token, id.trim());
      const state = await arenaApi.roomState(token, joined.room.id);
      setActiveState(state.state);
      await arenaResource.reload();
    } catch (error) {
      Alert.alert("Không tham gia được", error.message);
    } finally {
      setJoining(false);
    }
  };

  if (arenaResource.loading && !arenaResource.data) {
    return <LoadingState label="Đang tải đấu trường..." />;
  }

  const leaderboard = arenaResource.data?.leaderboard || [];
  const rooms = arenaResource.data?.rooms || [];
  const battles = arenaResource.data?.battles || [];
  const stats = user?.arenaStats || {};

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Đấu trường"
        title="Đấu trường hóa học"
        subtitle="Tạo phòng luyện tập, tham gia phòng chờ và theo dõi điểm đấu trường."
        right={<Pill label={`${stats.points || 0} điểm`} icon="trophy-outline" color={colors.green} />}
      />

      {arenaResource.error ? (
        <ErrorState message={arenaResource.error.message} onRetry={arenaResource.reload} />
      ) : null}

      <View style={styles.metricRow}>
        <Metric label="Trận" value={stats.total || 0} icon="game-controller-outline" color={colors.green} />
        <Metric label="Thắng" value={stats.wins || 0} icon="medal-outline" color={colors.green} />
        <Metric label="Thua" value={stats.losses || 0} icon="trending-down-outline" color={colors.red} />
      </View>

      <Card accent={colors.green} style={styles.roomCard}>
        <Text style={styles.cardTitle}>Phòng đấu</Text>
        <PrimaryButton
          label={creating ? "Đang tạo..." : "Luyện tập nhanh"}
          icon="flash-outline"
          color={colors.green}
          onPress={createPractice}
          disabled={creating}
        />
        <View style={styles.joinRow}>
          <TextField
            icon="keypad-outline"
            placeholder="Mã phòng"
            value={roomCode}
            onChangeText={setRoomCode}
            autoCapitalize="characters"
            style={styles.joinInput}
          />
          <GhostButton
            label={joining ? "..." : "Vào"}
            icon="enter-outline"
            onPress={() => joinRoom()}
            color={colors.green}
            style={styles.joinButton}
          />
        </View>
      </Card>

      {activeState ? (
        <>
          <SectionTitle title="Phòng đang mở" />
          <Card accent={colors.green} style={styles.activeCard}>
            <View style={styles.activeTop}>
              <View>
                <Text style={styles.activeTitle}>{activeState.room?.name || `Phòng ${activeState.room?.id}`}</Text>
                <Text style={styles.activeMeta}>
                  Vòng {(activeState.room?.current_round_index || 0) + 1}/{activeState.room?.total_rounds || 10} · {roomStatusLabel(activeState.room?.status)}
                </Text>
              </View>
              <Pill label={activeState.room?.id} color={colors.green} />
            </View>
            {activeState.currentQuestion ? (
              <View style={styles.questionBox}>
                <Text style={styles.questionType}>{questionTypeLabel(activeState.currentQuestion.gameType)}</Text>
                <Text style={styles.questionText}>{activeState.currentQuestion.question}</Text>
              </View>
            ) : (
              <Text style={styles.waitingText}>Phòng đang chờ bắt đầu hoặc chưa có câu hỏi hiện tại.</Text>
            )}
            <View style={styles.stack}>
              {(activeState.players || []).map((player) => (
                <ListRow
                  key={player.nguoi_dung_id}
                  icon="person-outline"
                  title={player.username}
                  subtitle={`${player.score || 0} điểm · ${player.correct_count || 0} câu đúng`}
                  color={colors.green}
                />
              ))}
            </View>
          </Card>
        </>
      ) : null}

      <SectionTitle title="Phòng chờ" actionLabel="Tải lại" onAction={arenaResource.reload} />
      {rooms.length > 0 ? (
        <View style={styles.stack}>
          {rooms.slice(0, 5).map((room) => (
            <ListRow
              key={room.id}
              icon="people-outline"
              title={room.name || `Phòng ${room.id}`}
              subtitle={`${room.host_name || "Chủ phòng"} · ${room.current_players || 0}/${room.max_players || 2} người`}
              color={colors.green}
              right={<GhostButton label="Vào" icon="enter-outline" onPress={() => joinRoom(room.id)} color={colors.green} style={styles.rowButton} />}
            />
          ))}
        </View>
      ) : (
        <EmptyState icon="people-outline" title="Chưa có phòng chờ" subtitle="Tạo phòng luyện tập hoặc quay lại sau để tìm đối thủ." />
      )}

      <SectionTitle title="Xếp hạng đấu trường" />
      <View style={styles.stack}>
        {leaderboard.slice(0, 5).map((item) => (
          <ListRow
            key={`${item.rank}-${item.name}`}
            icon={item.rank === 1 ? "medal-outline" : "trophy-outline"}
            title={`${item.rank}. ${item.name}`}
            subtitle={`${item.points} điểm · ${item.wins}/${item.total} trận thắng`}
            color={item.rank === 1 ? colors.green : colors.green}
          />
        ))}
      </View>

      <SectionTitle title="Trận gần đây" />
      {battles.length > 0 ? (
        <View style={styles.stack}>
          {battles.map((battle) => {
            const pointsDelta = battle.diem_thay_doi ?? 0;
            return (
              <ListRow
                key={battle.id}
                icon={battle.result === "win" ? "arrow-up-circle-outline" : "remove-circle-outline"}
                title={battle.opponent_name || "Đấu trường"}
                subtitle={`${battleResultLabel(battle.result)} · ${battle.score || 0} điểm · ${pointsDelta} điểm xếp hạng`}
                color={battle.result === "win" ? colors.green : colors.red}
              />
            );
          })}
        </View>
      ) : (
        <EmptyState icon="time-outline" title="Chưa có lịch sử trận" subtitle="Kết quả sẽ xuất hiện sau khi bạn hoàn thành trận đấu trường." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  roomCard: {
    gap: spacing.md
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900"
  },
  joinRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  joinInput: {
    flex: 1
  },
  joinButton: {
    width: 92
  },
  activeCard: {
    gap: spacing.md
  },
  activeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  activeTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900"
  },
  activeMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4
  },
  questionBox: {
    backgroundColor: "#f7f3ff",
    borderRadius: 18,
    padding: spacing.md,
    gap: spacing.sm
  },
  questionType: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  questionText: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800"
  },
  waitingText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  stack: {
    gap: spacing.sm
  },
  rowButton: {
    width: 72,
    minHeight: 38,
    paddingHorizontal: 8
  }
});


