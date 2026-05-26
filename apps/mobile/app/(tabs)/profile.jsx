import React from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import {
  Card,
  GhostButton,
  Metric,
  Pill,
  PrimaryButton,
  Screen,
  ScreenHeader,
  SectionTitle,
  TextField
} from "../../components/ui/Primitives";
import { colors, radius, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { classApi } from "../../services/api";

const targetOptions = [1, 2, 3, 5];
const grades = ["8", "9", "10", "11", "12"];

const roleLabel = (role) => {
  if (role === "student") return "Học sinh";
  if (role === "teacher") return "Giáo viên";
  if (role === "admin") return "Quản trị";
  return "Tài khoản";
};

export default function ProfileTab() {
  const { user, token, logout, updateProfile, refreshProfile } = useAuth();
  const [joinCode, setJoinCode] = React.useState("");
  const [savingPlan, setSavingPlan] = React.useState(false);
  const [joining, setJoining] = React.useState(false);

  const studyPlan = {
    dailyLessonTarget: user?.studyPlan?.dailyLessonTarget || 1,
    emailEnabled: Boolean(user?.studyPlan?.emailEnabled),
    completed: Boolean(user?.studyPlan?.completed),
    grade: user?.studyPlan?.grade || "10"
  };

  const savePlan = async (patch) => {
    setSavingPlan(true);
    const nextPlan = { ...studyPlan, ...patch };
    const result = await updateProfile({ studyPlan: nextPlan });
    setSavingPlan(false);
    if (!result.success) {
      Alert.alert("Không lưu được", result.message);
    }
  };

  const joinClass = async () => {
    if (!joinCode.trim()) return;
    setJoining(true);
    try {
      await classApi.join(token, joinCode.trim().toUpperCase());
      setJoinCode("");
      Alert.alert("Đã tham gia lớp", "Lớp học sẽ xuất hiện trong bảng điều khiển.");
      await refreshProfile();
    } catch (error) {
      Alert.alert("Không tham gia được", error.message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader
        eyebrow={roleLabel(user?.role)}
        title={user?.username || "Hồ sơ"}
        subtitle={user?.email || "Quản lý tiến độ học tập và phiên đăng nhập."}
        right={<Pill label={`Cấp ${user?.level || 1}`} icon="sparkles-outline" color={colors.green} />}
      />

      <View style={styles.metricRow}>
        <Metric label="Kinh nghiệm" value={user?.xp || 0} icon="flash-outline" color={colors.green} />
        <Metric label="Chuỗi học" value={user?.streakCount || 0} icon="flame-outline" color={colors.green} />
        <Metric label="Trực tuyến" value={`${user?.todayOnlineMinutes || 0}p`} icon="time-outline" color={colors.green} />
      </View>

      <SectionTitle title="Kế hoạch học" />
      <Card accent={colors.green} style={styles.planCard}>
        <View style={styles.planTop}>
          <View>
            <Text style={styles.cardTitle}>Mục tiêu mỗi ngày</Text>
            <Text style={styles.cardSubtitle}>
              {studyPlan.completed ? "Hôm nay đã hoàn thành mục tiêu." : "Hoàn thành bài để giữ nhịp học."}
            </Text>
          </View>
          <Pill label={studyPlan.completed ? "Đã xong" : "Đang mở"} color={studyPlan.completed ? colors.green : colors.green} />
        </View>

        <Text style={styles.fieldLabel}>Số bài/ngày</Text>
        <View style={styles.optionRow}>
          {targetOptions.map((target) => (
            <Pressable
              key={target}
              onPress={() => savePlan({ dailyLessonTarget: target })}
              disabled={savingPlan}
              style={[styles.optionChip, studyPlan.dailyLessonTarget === target ? styles.optionActive : null]}
            >
              <Text style={[styles.optionText, studyPlan.dailyLessonTarget === target ? styles.optionTextActive : null]}>
                {target}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Khối ưu tiên</Text>
        <View style={styles.optionRow}>
          {grades.map((grade) => (
            <Pressable
              key={grade}
              onPress={() => savePlan({ grade })}
              disabled={savingPlan}
              style={[styles.optionChip, String(studyPlan.grade) === grade ? styles.optionActiveDark : null]}
            >
              <Text style={[styles.optionText, String(studyPlan.grade) === grade ? styles.optionTextActive : null]}>
                {grade}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.fieldLabel}>Nhắc học qua thư điện tử</Text>
            <Text style={styles.cardSubtitle}>Hệ thống sẽ dùng thư điện tử trong hồ sơ để gửi nhắc học.</Text>
          </View>
          <Switch
            value={studyPlan.emailEnabled}
            onValueChange={(value) => savePlan({ emailEnabled: value })}
            trackColor={{ false: "#d0d5dd", true: "#bde99a" }}
            thumbColor={studyPlan.emailEnabled ? colors.green : "#ffffff"}
          />
        </View>
      </Card>

      <SectionTitle title="Lớp học" />
      <Card accent={colors.green} style={styles.joinCard}>
        <Text style={styles.cardTitle}>Tham gia lớp bằng mã</Text>
        <TextField
          icon="key-outline"
          placeholder="Mã lớp"
          value={joinCode}
          onChangeText={setJoinCode}
          autoCapitalize="characters"
        />
        <PrimaryButton
          label={joining ? "Đang tham gia..." : "Tham gia lớp"}
          icon="people-outline"
          color={colors.green}
          onPress={joinClass}
          disabled={joining}
        />
      </Card>

      <SectionTitle title="Tài khoản" />
      <Card style={styles.accountCard}>
        <Text style={styles.cardTitle}>Phiên đăng nhập</Text>
        <Text style={styles.cardSubtitle}>
          Đăng xuất khỏi thiết bị hiện tại và quay lại màn đăng nhập.
        </Text>
        <GhostButton label="Đăng xuất" icon="log-out-outline" onPress={logout} color={colors.red} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  planCard: {
    gap: spacing.md
  },
  planTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900"
  },
  cardSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    marginTop: 3
  },
  fieldLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900"
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  optionChip: {
    minWidth: 48,
    minHeight: 42,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  optionActive: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  optionActiveDark: {
    backgroundColor: colors.ink,
    borderColor: colors.ink
  },
  optionText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900"
  },
  optionTextActive: {
    color: "#ffffff"
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md
  },
  switchText: {
    flex: 1
  },
  joinCard: {
    gap: spacing.md
  },
  accountCard: {
    gap: spacing.md
  }
});
