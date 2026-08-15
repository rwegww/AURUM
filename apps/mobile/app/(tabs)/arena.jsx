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
import ArenaRoom from "../../components/arena/ArenaRoom";

const battleResultLabel = (result) => {
  if (result === "win") return "Thắng";
  if (result === "lose") return "Thua";
  if (result === "draw") return "Hòa";
  return "Đã đấu";
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
    if (!roomId) return;
    setActiveState(null);
    try {
      await arenaApi.leaveRoom(token, roomId);
      await arenaResource.reload();
    } catch (error) {
      Alert.alert("Không rời phòng được", error.message);
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
            disabled={joining}
            style={styles.joinButton}
          />
        </View>
      </Card>

      {activeState ? (
        <ArenaRoom
          token={token}
          roomId={activeState.room?.id}
          initialState={activeState}
          onStateChange={setActiveState}
          onLeave={leaveActiveRoom}
        />
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
              right={<GhostButton label="Vào" icon="enter-outline" onPress={() => joinRoom(room.id)} color={colors.green} disabled={joining} style={styles.rowButton} />}
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
  stack: {
    gap: spacing.sm
  },
  rowButton: {
    width: 72,
    minHeight: 38,
    paddingHorizontal: 8
  }
});


