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
  if (status === "waiting") return "Äang chá»";
  if (status === "active") return "Äang Ä‘áº¥u";
  if (status === "finished") return "ÄÃ£ káº¿t thÃºc";
  return "ChÆ°a rÃµ tráº¡ng thÃ¡i";
};

const battleResultLabel = (result) => {
  if (result === "win") return "Tháº¯ng";
  if (result === "lose") return "Thua";
  if (result === "draw") return "HÃ²a";
  return "ÄÃ£ Ä‘áº¥u";
};

const questionTypeLabel = (type) => {
  if (type === "calculation") return "TÃ­nh toÃ¡n";
  if (type === "balancing") return "CÃ¢n báº±ng phÆ°Æ¡ng trÃ¬nh";
  if (type === "atom_match") return "GhÃ©p nguyÃªn tá»­";
  if (type === "electron_match") return "Cáº¥u hÃ¬nh electron";
  if (type === "multiple_choice") return "Tráº¯c nghiá»‡m";
  return "CÃ¢u há»i";
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
        name: `${user?.username || "AURUM"} luyá»‡n táº­p`,
        mode: "solo",
        difficulty: "auto",
        max_players: 1,
        is_practice: true
      });
      const started = await arenaApi.startRoom(token, created.room.id);
      setActiveState(started.state);
    } catch (error) {
      Alert.alert("KhÃ´ng táº¡o Ä‘Æ°á»£c phÃ²ng", error.message);
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
      Alert.alert("KhÃ´ng tham gia Ä‘Æ°á»£c", error.message);
    } finally {
      setJoining(false);
    }
  };

  if (arenaResource.loading && !arenaResource.data) {
    return <LoadingState label="Äang táº£i Ä‘áº¥u trÆ°á»ng..." />;
  }

  const leaderboard = arenaResource.data?.leaderboard || [];
  const rooms = arenaResource.data?.rooms || [];
  const battles = arenaResource.data?.battles || [];
  const stats = user?.arenaStats || {};

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Äáº¥u trÆ°á»ng"
        title="Äáº¥u trÆ°á»ng hÃ³a há»c"
        subtitle="Táº¡o phÃ²ng luyá»‡n táº­p, tham gia phÃ²ng chá» vÃ  theo dÃµi Ä‘iá»ƒm Ä‘áº¥u trÆ°á»ng."
        right={<Pill label={`${stats.points || 0} Ä‘iá»ƒm`} icon="trophy-outline" color={colors.green} />}
      />

      {arenaResource.error ? (
        <ErrorState message={arenaResource.error.message} onRetry={arenaResource.reload} />
      ) : null}

      <View style={styles.metricRow}>
        <Metric label="Tráº­n" value={stats.total || 0} icon="game-controller-outline" color={colors.green} />
        <Metric label="Tháº¯ng" value={stats.wins || 0} icon="medal-outline" color={colors.green} />
        <Metric label="Thua" value={stats.losses || 0} icon="trending-down-outline" color={colors.red} />
      </View>

      <Card accent={colors.green} style={styles.roomCard}>
        <Text style={styles.cardTitle}>PhÃ²ng Ä‘áº¥u</Text>
        <PrimaryButton
          label={creating ? "Äang táº¡o..." : "Luyá»‡n táº­p nhanh"}
          icon="flash-outline"
          color={colors.green}
          onPress={createPractice}
          disabled={creating}
        />
        <View style={styles.joinRow}>
          <TextField
            icon="keypad-outline"
            placeholder="MÃ£ phÃ²ng"
            value={roomCode}
            onChangeText={setRoomCode}
            autoCapitalize="characters"
            style={styles.joinInput}
          />
          <GhostButton
            label={joining ? "..." : "VÃ o"}
            icon="enter-outline"
            onPress={() => joinRoom()}
            color={colors.green}
            style={styles.joinButton}
          />
        </View>
      </Card>

      {activeState ? (
        <>
          <SectionTitle title="PhÃ²ng Ä‘ang má»Ÿ" />
          <Card accent={colors.green} style={styles.activeCard}>
            <View style={styles.activeTop}>
              <View>
                <Text style={styles.activeTitle}>{activeState.room?.name || `PhÃ²ng ${activeState.room?.id}`}</Text>
                <Text style={styles.activeMeta}>
                  VÃ²ng {(activeState.room?.current_round_index || 0) + 1}/{activeState.room?.total_rounds || 10} Â· {roomStatusLabel(activeState.room?.status)}
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
              <Text style={styles.waitingText}>PhÃ²ng Ä‘ang chá» báº¯t Ä‘áº§u hoáº·c chÆ°a cÃ³ cÃ¢u há»i hiá»‡n táº¡i.</Text>
            )}
            <View style={styles.stack}>
              {(activeState.players || []).map((player) => (
                <ListRow
                  key={player.nguoi_dung_id}
                  icon="person-outline"
                  title={player.username}
                  subtitle={`${player.score || 0} Ä‘iá»ƒm Â· ${player.correct_count || 0} cÃ¢u Ä‘Ãºng`}
                  color={colors.green}
                />
              ))}
            </View>
          </Card>
        </>
      ) : null}

      <SectionTitle title="PhÃ²ng chá»" actionLabel="Táº£i láº¡i" onAction={arenaResource.reload} />
      {rooms.length > 0 ? (
        <View style={styles.stack}>
          {rooms.slice(0, 5).map((room) => (
            <ListRow
              key={room.id}
              icon="people-outline"
              title={room.name || `PhÃ²ng ${room.id}`}
              subtitle={`${room.host_name || "Chá»§ phÃ²ng"} Â· ${room.current_players || 0}/${room.max_players || 2} ngÆ°á»i`}
              color={colors.green}
              right={<GhostButton label="VÃ o" icon="enter-outline" onPress={() => joinRoom(room.id)} color={colors.green} style={styles.rowButton} />}
            />
          ))}
        </View>
      ) : (
        <EmptyState icon="people-outline" title="ChÆ°a cÃ³ phÃ²ng chá»" subtitle="Táº¡o phÃ²ng luyá»‡n táº­p hoáº·c quay láº¡i sau Ä‘á»ƒ tÃ¬m Ä‘á»‘i thá»§." />
      )}

      <SectionTitle title="Xáº¿p háº¡ng Ä‘áº¥u trÆ°á»ng" />
      <View style={styles.stack}>
        {leaderboard.slice(0, 5).map((item) => (
          <ListRow
            key={`${item.rank}-${item.name}`}
            icon={item.rank === 1 ? "medal-outline" : "trophy-outline"}
            title={`${item.rank}. ${item.name}`}
            subtitle={`${item.points} Ä‘iá»ƒm Â· ${item.wins}/${item.total} tráº­n tháº¯ng`}
            color={item.rank === 1 ? colors.green : colors.green}
          />
        ))}
      </View>

      <SectionTitle title="Tráº­n gáº§n Ä‘Ã¢y" />
      {battles.length > 0 ? (
        <View style={styles.stack}>
          {battles.map((battle) => {
            const pointsDelta = battle.diem_thay_doi ?? 0;
            return (
              <ListRow
                key={battle.id}
                icon={battle.result === "win" ? "arrow-up-circle-outline" : "remove-circle-outline"}
                title={battle.opponent_name || "Äáº¥u trÆ°á»ng"}
                subtitle={`${battleResultLabel(battle.result)} Â· ${battle.score || 0} Ä‘iá»ƒm Â· ${pointsDelta} Ä‘iá»ƒm xáº¿p háº¡ng`}
                color={battle.result === "win" ? colors.green : colors.red}
              />
            );
          })}
        </View>
      ) : (
        <EmptyState icon="time-outline" title="ChÆ°a cÃ³ lá»‹ch sá»­ tráº­n" subtitle="Káº¿t quáº£ sáº½ xuáº¥t hiá»‡n sau khi báº¡n hoÃ n thÃ nh tráº­n Ä‘áº¥u trÆ°á»ng." />
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


