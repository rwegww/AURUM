import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ErrorState, LoadingState } from "../../components/ui/Primitives";
import { colors, spacing, typography } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { arenaApi, publicApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";
import ArenaRoom from "../../components/arena/ArenaRoom";

const HERO_URI = "https://res.cloudinary.com/dpcorzgkm/image/upload/aurum/public/assets/images/home-viet-arena.png";
const MODES = {
  solo: { label: "Đấu đơn", players: 2, icon: "flash-outline" },
  "3vs3": { label: "Đội 3v3", players: 6, icon: "shield-outline" },
  "5vs5": { label: "Đội 5v5", players: 10, icon: "people-outline" }
};
const DIFFICULTIES = [
  ["easy", "Dễ"],
  ["medium", "Vừa"],
  ["hard", "Khó"],
  ["super", "Siêu khó"]
];
const RANKS = [
  { key: "Đồng", min: 0, color: "#b45309", bg: "#fff7ed" },
  { key: "Bạc", min: 500, color: "#475569", bg: "#f1f5f9" },
  { key: "Vàng", min: 1500, color: "#d97706", bg: "#fef3c7" },
  { key: "Kim cương", min: 3000, color: "#2563eb", bg: "#eff6ff" },
  { key: "Bậc thầy", min: 6000, color: colors.greenDark, bg: "#ecfdf3" }
];

const modeLabel = (mode) => MODES[mode]?.label || mode || "Đấu đơn";
const difficultyLabel = (difficulty) => DIFFICULTIES.find(([key]) => key === difficulty)?.[1] || "Theo trình độ";
const battleResultLabel = (result) => result === "win" ? "Thắng" : result === "lose" ? "Thua" : result === "draw" ? "Hòa" : "Đã đấu";

const Avatar = ({ user, size = 88 }) => {
  const seed = user?.avatarSeed || user?.username || user?.name || "Aurum";
  const source = user?.avatarUrl || `https://api.dicebear.com/9.x/lorelei/png?seed=${encodeURIComponent(seed)}`;
  return (
    <View style={[styles.avatarRing, { height: size, width: size, borderRadius: size / 2 }]}>
      <Image source={{ uri: source }} style={[styles.avatarImage, { borderRadius: size / 2 }]} />
      {user?.level ? <View style={styles.levelBadge}><Text style={styles.levelBadgeText}>{user.level}</Text></View> : null}
    </View>
  );
};

const Panel = ({ children, style }) => <View style={[styles.panel, style]}>{children}</View>;

const ArenaButton = ({ label, icon, onPress, disabled, color = colors.green, outline = false, style }) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      styles.actionButton,
      outline ? styles.actionButtonOutline : { backgroundColor: color, borderColor: color },
      pressed && !disabled ? styles.actionButtonPressed : null,
      disabled ? styles.disabled : null,
      style
    ]}
  >
    {icon ? <Ionicons name={icon} size={19} color={outline ? colors.ink : "#ffffff"} /> : null}
    <Text style={[styles.actionButtonText, outline ? styles.actionButtonTextOutline : null]} numberOfLines={1}>{label}</Text>
  </Pressable>
);

const ModeSelector = ({ value, onChange, disabled }) => (
  <View style={styles.modeRow}>
    {Object.entries(MODES).map(([key, config]) => {
      const active = value === key;
      return (
        <Pressable key={key} disabled={disabled} onPress={() => onChange(key)} style={[styles.modeCard, active ? styles.modeCardActive : null, disabled ? styles.disabled : null]}>
          <Ionicons name={config.icon} size={21} color={active ? colors.green : colors.muted} />
          <Text style={styles.modeTitle}>{config.label}</Text>
          <Text style={styles.modePlayers}>{config.players} người</Text>
        </Pressable>
      );
    })}
  </View>
);

const StatTile = ({ label, value, icon, color = colors.green }) => (
  <View style={styles.statTile}>
    <Ionicons name={icon} size={17} color={color} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const RankSummary = ({ points = 0 }) => {
  const current = [...RANKS].reverse().find((rank) => points >= rank.min) || RANKS[0];
  const next = RANKS.find((rank) => rank.min > points);
  const progress = next ? Math.min(1, (points - current.min) / (next.min - current.min)) : 1;
  return (
    <View style={[styles.rankCard, { backgroundColor: current.bg, borderColor: `${current.color}33` }]}>
      <View style={styles.rankTop}>
        <View style={styles.rankIcon}><Ionicons name="medal-outline" size={23} color={current.color} /></View>
        <View style={styles.rankCopy}><Text style={styles.rankEyebrow}>Hạng hiện tại</Text><Text style={[styles.rankName, { color: current.color }]}>{current.key}</Text></View>
      </View>
      <View style={styles.rankTrack}><View style={[styles.rankFill, { width: `${progress * 100}%` }]} /></View>
      <Text style={styles.rankHint}>{next ? `Còn ${next.min - points} điểm để lên ${next.key}` : "Bạn đang ở hạng cao nhất"}</Text>
    </View>
  );
};

const CreateRoomModal = ({ visible, user, creating, onClose, onCreate }) => {
  const isModerator = ["teacher", "admin"].includes(user?.role);
  const [name, setName] = React.useState("");
  const [mode, setMode] = React.useState("solo");
  const [difficulty, setDifficulty] = React.useState(isModerator ? "easy" : "auto");

  React.useEffect(() => {
    if (visible) {
      setName("");
      setMode("solo");
      setDifficulty(isModerator ? "easy" : "auto");
    }
  }, [isModerator, visible]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalSafeArea}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View><Text style={styles.modalEyebrow}>Thiết lập phòng đấu</Text><Text style={styles.modalTitle}>Tạo <Text style={styles.greenText}>phòng đấu</Text></Text></View>
            <Pressable onPress={onClose} style={styles.modalClose}><Ionicons name="close" size={22} color={colors.muted} /></Pressable>
          </View>

          <Text style={styles.fieldLabel}>Tên phòng đấu</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Ví dụ: Phòng Hóa 8A" placeholderTextColor="#98a2b3" style={styles.textInput} />

          <Text style={styles.fieldLabel}>Thể thức thi đấu</Text>
          <ModeSelector value={mode} onChange={setMode} />

          <Text style={styles.fieldLabel}>Độ khó</Text>
          {isModerator ? (
            <View style={styles.difficultyRow}>
              {DIFFICULTIES.map(([key, label]) => (
                <Pressable key={key} onPress={() => setDifficulty(key)} style={[styles.difficultyChip, difficulty === key ? styles.difficultyChipActive : null]}>
                  <Text style={[styles.difficultyText, difficulty === key ? styles.difficultyTextActive : null]}>{label}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.autoDifficulty}><Text style={styles.autoDifficultyText}>Tự động theo trình độ của bạn</Text><Ionicons name="shield-checkmark-outline" size={20} color={colors.muted} /></View>
          )}

          <ArenaButton label={creating ? "Đang tạo..." : "Tạo phòng đấu ngay"} icon="add" disabled={creating || !name.trim()} onPress={() => onCreate({ name: name.trim(), mode, difficulty })} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default function ArenaTab() {
  const { token, user, refreshProfile } = useAuth();
  const [roomCode, setRoomCode] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [joining, setJoining] = React.useState(false);
  const [activeState, setActiveState] = React.useState(null);
  const [findMode, setFindMode] = React.useState("solo");
  const [searching, setSearching] = React.useState(false);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const searchTimerRef = React.useRef(null);
  const searchGenerationRef = React.useRef(0);
  const isModerator = ["teacher", "admin"].includes(user?.role);

  const arenaResource = useApiResource(async () => {
    const [leaderboard, rooms, battles, online] = await Promise.all([
      arenaApi.leaderboard().catch(() => ({ leaderboard: [] })),
      arenaApi.rooms().catch(() => ({ rooms: [] })),
      token ? arenaApi.myBattles(token).catch(() => ({ battles: [] })) : { battles: [] },
      publicApi.onlineCount().catch(() => ({ count: 0 }))
    ]);
    return {
      leaderboard: leaderboard?.leaderboard || [],
      rooms: rooms?.rooms || [],
      battles: battles?.battles || [],
      onlineCount: Number.isFinite(Number(online?.count)) ? Math.max(0, Number(online.count)) : 0
    };
  }, [token]);

  const cancelSearch = React.useCallback(() => {
    searchGenerationRef.current += 1;
    if (searchTimerRef.current) clearInterval(searchTimerRef.current);
    searchTimerRef.current = null;
    setSearching(false);
  }, []);

  React.useEffect(() => () => cancelSearch(), [cancelSearch]);

  const activateRoom = React.useCallback(async (roomId) => {
    cancelSearch();
    const response = await arenaApi.roomState(token, roomId);
    if (!response?.state?.room) throw new Error("Máy chủ chưa trả về trạng thái phòng hợp lệ.");
    setActiveState(response.state);
  }, [cancelSearch, token]);

  const findMatch = () => {
    if (searching) {
      cancelSearch();
      return;
    }
    const generation = searchGenerationRef.current + 1;
    searchGenerationRef.current = generation;
    setSearching(true);
    const check = async () => {
      try {
        const response = await arenaApi.findMatch(token, findMode);
        if (generation !== searchGenerationRef.current) return;
        if (response?.found && response?.room?.id) await activateRoom(response.room.id);
      } catch (error) {
        if (generation === searchGenerationRef.current) {
          cancelSearch();
          Alert.alert("Chưa tìm được trận", error.message);
        }
      }
    };
    check();
    searchTimerRef.current = setInterval(check, 3000);
  };

  const createPractice = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const created = await arenaApi.createRoom(token, {
        name: "Luyện tập Arena",
        mode: "solo",
        difficulty: "auto",
        max_players: 1,
        is_practice: true,
        as_player: true,
      });
      const started = await arenaApi.startRoom(token, created.room.id);
      setActiveState(started.state);
    } catch (error) {
      Alert.alert("Không tạo được phòng", error.message);
    } finally {
      setCreating(false);
    }
  };

  const createRoom = async ({ name, mode, difficulty }) => {
    if (creating) return;
    setCreating(true);
    try {
      const created = await arenaApi.createRoom(token, {
        name,
        mode,
        difficulty,
        max_players: MODES[mode]?.players || 2,
        as_player: true,
      });
      await activateRoom(created.room.id);
      setCreateModalOpen(false);
    } catch (error) {
      Alert.alert("Không tạo được phòng", error.message);
    } finally {
      setCreating(false);
    }
  };

  const joinRoom = async (id = roomCode) => {
    const roomId = String(id ?? "").trim();
    if (!roomId || joining) return;
    setJoining(true);
    try {
      const joined = await arenaApi.joinRoom(token, roomId);
      await activateRoom(joined.room?.id || roomId);
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
    setActiveState(null);
    if (!roomId) return;
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
      .then((response) => response?.room?.id ? arenaApi.roomState(token, response.room.id) : null)
      .then((response) => { if (active && response?.state) setActiveState(response.state); })
      .catch(() => {});
    return () => { active = false; };
  }, [token]);

  if (arenaResource.loading && !arenaResource.data) return <LoadingState label="Đang tải đấu trường..." />;

  const data = arenaResource.data || {};
  const leaderboard = data.leaderboard || [];
  const rooms = data.rooms || [];
  const battles = data.battles || [];
  const stats = user?.arenaStats || {};
  const totalMatches = Number(stats.total || 0);
  const winRate = totalMatches ? Math.round((Number(stats.wins || 0) / totalMatches) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        {arenaResource.error ? <ErrorState message={arenaResource.error.message} onRetry={arenaResource.reload} /> : null}

        <Panel style={styles.profilePanel}>
          <View style={styles.panelHeading}>
            <View><Text style={styles.panelEyebrow}>Hồ sơ thi đấu</Text><Text style={styles.profileName}>{user?.username || "Aurum"}</Text></View>
            <View style={styles.syncedPill}><Ionicons name="checkmark-circle" size={15} color={colors.green} /><Text style={styles.syncedText}>Đã đồng bộ</Text></View>
          </View>
          <View style={styles.profileBody}>
            <Avatar user={user} />
            <View style={styles.profileStats}>
              <StatTile label="Cấp độ" value={user?.level || 1} icon="sparkles-outline" />
              <StatTile label="Khối" value={user?.grade || user?.studyPlan?.grade || "—"} icon="school-outline" />
              <StatTile label="Chuỗi" value={user?.streakCount || 0} icon="flame-outline" color="#f97316" />
              <StatTile label="Điểm đấu" value={stats.points || 0} icon="trophy-outline" />
            </View>
          </View>
        </Panel>

        <ImageBackground source={{ uri: HERO_URI }} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}><Ionicons name="flash" size={16} color={colors.green} /><Text style={styles.heroBadgeText}>Thi đấu</Text></View>
            <Text style={styles.heroTitle}>ĐẤU TRƯỜNG <Text style={styles.heroTitleGreen}>HÓA HỌC</Text></Text>
            <Text style={styles.heroSubtitle}>Thi đấu & chinh phục kiến thức</Text>
          </View>
        </ImageBackground>

        <Panel style={styles.actionPanel}>
          <View style={styles.actionHeading}>
            <View><Text style={styles.panelEyebrow}>Thi đấu nhanh</Text><Text style={styles.sectionTitle}>Tìm đối thủ</Text></View>
            <View style={styles.onlinePill}><View style={styles.onlineDot} /><Text style={styles.onlineText}>{data.onlineCount ?? 0} học sinh online</Text></View>
          </View>
          <Text style={styles.fieldLabel}>Chọn thể thức</Text>
          <ModeSelector value={findMode} onChange={setFindMode} disabled={searching} />
          <ArenaButton label={searching ? "Hủy tìm trận" : "Tìm trận ngay"} icon={searching ? "close" : "search"} onPress={findMatch} color={searching ? colors.red : colors.green} />
          <View style={styles.twoColumns}>
            <ArenaButton label="Tạo phòng" icon="add" outline onPress={() => setCreateModalOpen(true)} style={styles.flexButton} />
            <ArenaButton label={creating ? "Đang tạo..." : "Luyện tập"} icon="flask-outline" outline disabled={creating} onPress={createPractice} style={styles.flexButton} />
          </View>
        </Panel>

        <Panel style={styles.joinPanel}>
          <View style={styles.joinHeading}><Ionicons name="enter-outline" size={22} color="#2563eb" /><View><Text style={styles.sectionTitle}>Vào phòng bằng mã</Text><Text style={styles.sectionSubtitle}>Nhập mã phòng do chủ phòng gửi.</Text></View></View>
          <View style={styles.joinRow}>
            <TextInput value={roomCode} onChangeText={(value) => setRoomCode(value.toUpperCase().slice(0, 12))} placeholder="Mã phòng" placeholderTextColor="#98a2b3" autoCapitalize="characters" style={styles.joinInput} />
            <ArenaButton label={joining ? "..." : "Vào phòng"} icon="play" disabled={joining || !roomCode.trim()} onPress={() => joinRoom()} color="#1e293b" style={styles.joinButton} />
          </View>
        </Panel>

        <Panel style={styles.roomsPanel}>
          <View style={styles.actionHeading}><View><Text style={styles.panelEyebrow}>Phòng đấu trực tuyến</Text><Text style={styles.sectionTitle}>Phòng đang mở</Text></View><Pressable onPress={arenaResource.reload} style={styles.refreshButton}><Ionicons name="refresh" size={18} color={colors.green} /></Pressable></View>
          {rooms.length ? rooms.slice(0, 5).map((room) => {
            const full = Number(room.current_players || 0) >= Number(room.max_players || 2);
            return (
              <View key={room.id} style={styles.roomRow}>
                <View style={styles.roomIcon}><Ionicons name="game-controller-outline" size={22} color={colors.green} /></View>
                <View style={styles.roomCopy}><Text style={styles.roomName} numberOfLines={1}>{room.name || `Phòng ${room.id}`}</Text><Text style={styles.roomMeta}>{room.host_name || "Chủ phòng"} · {modeLabel(room.mode)} · {difficultyLabel(room.difficulty)}</Text></View>
                <View style={styles.roomAction}><Text style={styles.roomPlayers}>{room.current_players || 0}/{room.max_players || 2}</Text><Pressable disabled={full || joining} onPress={() => joinRoom(room.id)} style={[styles.enterRoom, full ? styles.disabled : null]}><Ionicons name={full ? "lock-closed" : "play"} size={15} color="#ffffff" /></Pressable></View>
              </View>
            );
          }) : <Text style={styles.emptyText}>Chưa có phòng chờ. Bạn có thể tạo phòng đầu tiên.</Text>}
        </Panel>

        <Panel style={styles.statsPanel}>
          <View style={styles.actionHeading}><Text style={styles.sectionTitle}>Thống kê thi đấu</Text><Ionicons name="stats-chart" size={20} color={colors.green} /></View>
          <View style={styles.profileStats}>
            <StatTile label="Tổng trận" value={totalMatches} icon="clipboard-outline" />
            <StatTile label="Thắng" value={stats.wins || 0} icon="trophy-outline" />
            <StatTile label="Thua" value={stats.losses || 0} icon="shield-outline" />
            <StatTile label="Tỉ lệ thắng" value={`${winRate}%`} icon="trending-up-outline" />
          </View>
          <RankSummary points={Number(stats.points || 0)} />
        </Panel>

        <Panel style={styles.leaderboardPanel}>
          <View style={styles.actionHeading}><Text style={styles.sectionTitle}>Bảng xếp hạng</Text><View style={styles.trophyBox}><Ionicons name="trophy" size={18} color="#4d3903" /></View></View>
          {leaderboard.length ? leaderboard.slice(0, 3).map((player, index) => {
            const rank = Number(player.rank) || index + 1;
            const champion = rank === 1;
            return (
              <View key={`${rank}-${player.name}`} style={[styles.leaderRow, champion ? styles.leaderRowChampion : null]}>
                <Text style={[styles.leaderRank, champion ? styles.whiteText : null]}>{rank}</Text>
                <Avatar user={{ username: player.name, avatarSeed: player.avatarSeed, level: player.level }} size={42} />
                <View style={styles.leaderCopy}><Text style={[styles.leaderName, champion ? styles.whiteText : null]} numberOfLines={1}>{player.name}</Text><Text style={[styles.leaderWins, champion ? styles.championMuted : null]}>{player.wins} trận thắng</Text></View>
                <View><Text style={[styles.leaderPoints, champion ? styles.championPoints : null]}>{player.points}</Text><Text style={[styles.leaderPointsLabel, champion ? styles.championMuted : null]}>Điểm</Text></View>
              </View>
            );
          }) : <Text style={styles.emptyText}>Bảng xếp hạng đang trống.</Text>}
        </Panel>

        <Panel style={styles.historyPanel}>
          <View style={styles.actionHeading}><Text style={styles.sectionTitle}>Nhật ký thi đấu</Text><Ionicons name="time-outline" size={20} color="#2563eb" /></View>
          {battles.length ? battles.map((battle) => {
            const delta = battle.diem_thay_doi ?? 0;
            return (
              <View key={battle.id || battle.played_at} style={styles.historyRow}>
                <View style={[styles.historyIcon, { backgroundColor: battle.result === "win" ? "#ecfdf3" : battle.result === "lose" ? "#fef2f2" : "#fffbeb" }]}><Ionicons name={battle.result === "win" ? "trophy-outline" : battle.result === "lose" ? "shield-outline" : "medal-outline"} size={18} color={battle.result === "win" ? colors.green : battle.result === "lose" ? colors.red : colors.amber} /></View>
                <View style={styles.historyCopy}><Text style={styles.historyName} numberOfLines={1}>{battle.opponent_name || "Đấu trường"}</Text><Text style={styles.historyMeta}>{battleResultLabel(battle.result)} · {battle.score || 0} điểm</Text></View>
                <Text style={[styles.delta, { color: delta > 0 ? colors.greenDark : delta < 0 ? colors.red : colors.muted }]}>{delta > 0 ? "+" : ""}{delta}</Text>
              </View>
            );
          }) : <Text style={styles.emptyText}>Chưa có trận đấu nào gần đây.</Text>}
        </Panel>
      </ScrollView>

      <CreateRoomModal visible={createModalOpen} user={user} creating={creating} onClose={() => setCreateModalOpen(false)} onCreate={createRoom} />

      {activeState ? (
        <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={leaveActiveRoom}>
          <SafeAreaView style={[styles.battleSafeArea, activeState.room?.status === "playing" ? styles.battleSafeAreaDark : null]}>
            <ScrollView contentContainerStyle={styles.battleContent} showsVerticalScrollIndicator={false}>
              <ArenaRoom token={token} roomId={activeState.room?.id} initialState={activeState} onStateChange={setActiveState} onLeave={leaveActiveRoom} />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#f8faf7", flex: 1 },
  page: { gap: 16, padding: 16, paddingBottom: 36 },
  panel: { backgroundColor: "#ffffff", borderColor: "#e1e6dc", borderRadius: 12, borderWidth: 1, padding: 16 },
  panelHeading: { alignItems: "center", borderBottomColor: "#e1e6dc", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", paddingBottom: 13 },
  panelEyebrow: { color: "#7b8782", fontFamily: typography.bold, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase" },
  profileName: { color: colors.ink, fontFamily: typography.bold, fontSize: 22, marginTop: 3 },
  syncedPill: { alignItems: "center", backgroundColor: "#edf8e5", borderRadius: 10, flexDirection: "row", gap: 5, paddingHorizontal: 9, paddingVertical: 7 },
  syncedText: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 10, textTransform: "uppercase" },
  profileBody: { alignItems: "center", gap: 16, paddingTop: 16 },
  avatarRing: { backgroundColor: "#ffffff", borderColor: "#d7e5ce", borderWidth: 3, position: "relative" },
  avatarImage: { height: "100%", width: "100%" },
  levelBadge: { alignItems: "center", backgroundColor: colors.green, borderColor: "#ffffff", borderRadius: 8, borderWidth: 2, height: 26, justifyContent: "center", left: -4, position: "absolute", top: -4, width: 26 },
  levelBadgeText: { color: "#ffffff", fontFamily: typography.bold, fontSize: 10 },
  profileStats: { flexDirection: "row", flexWrap: "wrap", gap: 10, width: "100%" },
  statTile: { borderColor: "#e1e6dc", borderRadius: 10, borderWidth: 1, flexBasis: "47%", flexGrow: 1, gap: 4, minHeight: 78, padding: 11 },
  statLabel: { color: "#7b8782", fontFamily: typography.bold, fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase" },
  statValue: { color: colors.ink, fontFamily: typography.bold, fontSize: 20 },
  hero: { height: 260, justifyContent: "flex-end", overflow: "hidden" },
  heroImage: { borderRadius: 12 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.42)", borderRadius: 12 },
  heroContent: { gap: 8, padding: 20 },
  heroBadge: { alignItems: "center", alignSelf: "flex-start", backgroundColor: "#ffffff", borderRadius: 9, flexDirection: "row", gap: 6, paddingHorizontal: 10, paddingVertical: 8 },
  heroBadgeText: { color: colors.green, fontFamily: typography.bold, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" },
  heroTitle: { color: "#ffffff", fontFamily: typography.bold, fontSize: 31, lineHeight: 36 },
  heroTitleGreen: { color: "#8ed64d" },
  heroSubtitle: { color: "rgba(255,255,255,0.82)", fontFamily: typography.bold, fontSize: 13 },
  actionPanel: { gap: 14 },
  actionHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 10 },
  sectionTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 20, marginTop: 2 },
  sectionSubtitle: { color: colors.muted, fontFamily: typography.medium, fontSize: 12, marginTop: 2 },
  onlinePill: { alignItems: "center", borderColor: "#e1e6dc", borderRadius: 9, borderWidth: 1, flexDirection: "row", gap: 6, paddingHorizontal: 9, paddingVertical: 8 },
  onlineDot: { backgroundColor: colors.green, borderRadius: 4, height: 8, width: 8 },
  onlineText: { color: colors.ink, fontFamily: typography.bold, fontSize: 10 },
  fieldLabel: { color: "#7b8782", fontFamily: typography.bold, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" },
  modeRow: { flexDirection: "row", gap: 8 },
  modeCard: { borderColor: "#e1e6dc", borderRadius: 10, borderWidth: 1, flex: 1, gap: 5, minHeight: 94, padding: 10 },
  modeCardActive: { backgroundColor: "#f0f9e8", borderColor: colors.green },
  modeTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 12 },
  modePlayers: { color: colors.muted, fontFamily: typography.medium, fontSize: 10 },
  actionButton: { alignItems: "center", borderBottomColor: "rgba(0,0,0,0.15)", borderBottomWidth: 4, borderRadius: 10, borderWidth: 1, flexDirection: "row", gap: 8, justifyContent: "center", minHeight: 52, paddingHorizontal: 14 },
  actionButtonOutline: { backgroundColor: "#ffffff", borderBottomColor: "#e1e6dc", borderColor: "#e1e6dc" },
  actionButtonPressed: { opacity: 0.88, transform: [{ translateY: 2 }] },
  actionButtonText: { color: "#ffffff", flexShrink: 1, fontFamily: typography.bold, fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase" },
  actionButtonTextOutline: { color: colors.ink },
  disabled: { opacity: 0.45 },
  twoColumns: { flexDirection: "row", gap: 9 },
  flexButton: { flex: 1 },
  joinPanel: { gap: 14 },
  joinHeading: { alignItems: "center", flexDirection: "row", gap: 10 },
  joinRow: { flexDirection: "row", gap: 8 },
  joinInput: { backgroundColor: "#f8fafc", borderColor: "#e1e6dc", borderRadius: 10, borderWidth: 1, color: colors.ink, flex: 1, fontFamily: typography.bold, fontSize: 16, letterSpacing: 2, minHeight: 52, paddingHorizontal: 14, textAlign: "center" },
  joinButton: { minWidth: 116 },
  roomsPanel: { gap: 12 },
  refreshButton: { alignItems: "center", borderColor: "#e1e6dc", borderRadius: 9, borderWidth: 1, height: 38, justifyContent: "center", width: 38 },
  roomRow: { alignItems: "center", borderColor: "#e1e6dc", borderRadius: 10, borderWidth: 1, flexDirection: "row", gap: 9, padding: 10 },
  roomIcon: { alignItems: "center", backgroundColor: "#f0f9e8", borderRadius: 10, height: 42, justifyContent: "center", width: 42 },
  roomCopy: { flex: 1 },
  roomName: { color: colors.ink, fontFamily: typography.bold, fontSize: 14 },
  roomMeta: { color: colors.muted, fontFamily: typography.medium, fontSize: 10, lineHeight: 15, marginTop: 2 },
  roomAction: { alignItems: "center", gap: 5 },
  roomPlayers: { color: colors.greenDark, fontFamily: typography.bold, fontSize: 11 },
  enterRoom: { alignItems: "center", backgroundColor: "#1e293b", borderRadius: 9, height: 34, justifyContent: "center", width: 38 },
  emptyText: { color: colors.muted, fontFamily: typography.medium, fontSize: 13, lineHeight: 20, paddingVertical: 14, textAlign: "center" },
  statsPanel: { gap: 14 },
  rankCard: { borderRadius: 10, borderWidth: 1, gap: 10, padding: 14 },
  rankTop: { alignItems: "center", flexDirection: "row", gap: 10 },
  rankIcon: { alignItems: "center", backgroundColor: "#ffffff", borderRadius: 10, height: 42, justifyContent: "center", width: 42 },
  rankCopy: { flex: 1 },
  rankEyebrow: { color: colors.muted, fontFamily: typography.bold, fontSize: 9, letterSpacing: 1, textTransform: "uppercase" },
  rankName: { fontFamily: typography.bold, fontSize: 18, marginTop: 2 },
  rankTrack: { backgroundColor: "#ffffff", borderRadius: 999, height: 8, overflow: "hidden" },
  rankFill: { backgroundColor: colors.green, borderRadius: 999, height: "100%" },
  rankHint: { color: colors.muted, fontFamily: typography.medium, fontSize: 11 },
  leaderboardPanel: { borderBottomWidth: 5, gap: 10 },
  trophyBox: { alignItems: "center", backgroundColor: "#f4cc54", borderRadius: 10, height: 36, justifyContent: "center", width: 36 },
  leaderRow: { alignItems: "center", backgroundColor: "#f9faf7", borderColor: "#e1e6dc", borderRadius: 16, borderWidth: 1, flexDirection: "row", gap: 9, padding: 10 },
  leaderRowChampion: { backgroundColor: "#173c31", borderColor: "#244c40", borderBottomColor: "#102c25", borderBottomWidth: 4 },
  leaderRank: { color: colors.ink, fontFamily: typography.bold, fontSize: 15, textAlign: "center", width: 20 },
  leaderCopy: { flex: 1 },
  leaderName: { color: colors.ink, fontFamily: typography.bold, fontSize: 13 },
  leaderWins: { color: colors.muted, fontFamily: typography.bold, fontSize: 8, letterSpacing: 0.7, marginTop: 2, textTransform: "uppercase" },
  leaderPoints: { color: colors.ink, fontFamily: typography.bold, fontSize: 17, textAlign: "right" },
  leaderPointsLabel: { color: colors.muted, fontFamily: typography.bold, fontSize: 7, letterSpacing: 0.7, textAlign: "right", textTransform: "uppercase" },
  whiteText: { color: "#ffffff" },
  championMuted: { color: "rgba(255,255,255,0.5)" },
  championPoints: { color: "#f4cc54" },
  historyPanel: { gap: 10 },
  historyRow: { alignItems: "center", borderColor: "#e1e6dc", borderRadius: 10, borderWidth: 1, flexDirection: "row", gap: 10, padding: 10 },
  historyIcon: { alignItems: "center", borderRadius: 9, height: 38, justifyContent: "center", width: 38 },
  historyCopy: { flex: 1 },
  historyName: { color: colors.ink, fontFamily: typography.bold, fontSize: 13 },
  historyMeta: { color: colors.muted, fontFamily: typography.medium, fontSize: 10, marginTop: 2 },
  delta: { fontFamily: typography.bold, fontSize: 13 },
  modalSafeArea: { backgroundColor: "#ffffff", flex: 1 },
  modalContent: { gap: 16, padding: 20, paddingBottom: 40 },
  modalHeader: { alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between" },
  modalEyebrow: { color: colors.green, fontFamily: typography.bold, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase" },
  modalTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 29, marginTop: 3 },
  greenText: { color: colors.green },
  modalClose: { alignItems: "center", borderColor: "#e1e6dc", borderRadius: 10, borderWidth: 1, height: 42, justifyContent: "center", width: 42 },
  textInput: { borderColor: "#e1e6dc", borderRadius: 10, borderWidth: 1, color: colors.ink, fontFamily: typography.bold, fontSize: 15, minHeight: 52, paddingHorizontal: 14 },
  difficultyRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  difficultyChip: { borderColor: "#e1e6dc", borderRadius: 10, borderWidth: 1, flexBasis: "47%", flexGrow: 1, padding: 14 },
  difficultyChipActive: { backgroundColor: "#f0f9e8", borderColor: colors.green },
  difficultyText: { color: colors.ink, fontFamily: typography.bold, fontSize: 13 },
  difficultyTextActive: { color: colors.greenDark },
  autoDifficulty: { alignItems: "center", backgroundColor: "#f8fafc", borderColor: "#e1e6dc", borderRadius: 10, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", padding: 14 },
  autoDifficultyText: { color: colors.ink, fontFamily: typography.bold, fontSize: 13 },
  battleSafeArea: { backgroundColor: "#f8faf7", flex: 1 },
  battleSafeAreaDark: { backgroundColor: "#020617" },
  battleContent: { flexGrow: 1, padding: 16 }
});
