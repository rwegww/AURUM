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
  if (role === "student") return "Há»c sinh";
  if (role === "teacher") return "GiÃ¡o viÃªn";
  if (role === "admin") return "Quáº£n trá»‹";
  return "TÃ i khoáº£n";
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
      Alert.alert("KhÃ´ng lÆ°u Ä‘Æ°á»£c", result.message);
    }
  };

  const joinClass = async () => {
    if (!joinCode.trim()) return;
    setJoining(true);
    try {
      await classApi.join(token, joinCode.trim().toUpperCase());
      setJoinCode("");
      Alert.alert("ÄÃ£ tham gia lá»›p", "Lá»›p há»c sáº½ xuáº¥t hiá»‡n trong báº£ng Ä‘iá»u khiá»ƒn.");
      await refreshProfile();
    } catch (error) {
      Alert.alert("KhÃ´ng tham gia Ä‘Æ°á»£c", error.message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader
        eyebrow={roleLabel(user?.role)}
        title={user?.username || "Há»“ sÆ¡"}
        subtitle={user?.email || "Quáº£n lÃ½ tiáº¿n Ä‘á»™ há»c táº­p vÃ  phiÃªn Ä‘Äƒng nháº­p."}
        right={<Pill label={`Cáº¥p ${user?.level || 1}`} icon="sparkles-outline" color={colors.green} />}
      />

      <View style={styles.metricRow}>
        <Metric label="Kinh nghiá»‡m" value={user?.xp || 0} icon="flash-outline" color={colors.green} />
        <Metric label="Chuá»—i há»c" value={user?.streakCount || 0} icon="flame-outline" color={colors.green} />
        <Metric label="Trá»±c tuyáº¿n" value={`${user?.todayOnlineMinutes || 0}p`} icon="time-outline" color={colors.green} />
      </View>

      <SectionTitle title="Káº¿ hoáº¡ch há»c" />
      <Card accent={colors.green} style={styles.planCard}>
        <View style={styles.planTop}>
          <View>
            <Text style={styles.cardTitle}>Má»¥c tiÃªu má»—i ngÃ y</Text>
            <Text style={styles.cardSubtitle}>
              {studyPlan.completed ? "HÃ´m nay Ä‘Ã£ hoÃ n thÃ nh má»¥c tiÃªu." : "HoÃ n thÃ nh bÃ i Ä‘á»ƒ giá»¯ nhá»‹p há»c."}
            </Text>
          </View>
          <Pill label={studyPlan.completed ? "ÄÃ£ xong" : "Äang má»Ÿ"} color={studyPlan.completed ? colors.green : colors.green} />
        </View>

        <Text style={styles.fieldLabel}>Sá»‘ bÃ i/ngÃ y</Text>
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

        <Text style={styles.fieldLabel}>Khá»‘i Æ°u tiÃªn</Text>
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
            <Text style={styles.fieldLabel}>Nháº¯c há»c qua thÆ° Ä‘iá»‡n tá»­</Text>
            <Text style={styles.cardSubtitle}>Há»‡ thá»‘ng sáº½ dÃ¹ng thÆ° Ä‘iá»‡n tá»­ trong há»“ sÆ¡ Ä‘á»ƒ gá»­i nháº¯c há»c.</Text>
          </View>
          <Switch
            value={studyPlan.emailEnabled}
            onValueChange={(value) => savePlan({ emailEnabled: value })}
            trackColor={{ false: "#d0d5dd", true: "#bde99a" }}
            thumbColor={studyPlan.emailEnabled ? colors.green : "#ffffff"}
          />
        </View>
      </Card>

      <SectionTitle title="Lá»›p há»c" />
      <Card accent={colors.green} style={styles.joinCard}>
        <Text style={styles.cardTitle}>Tham gia lá»›p báº±ng mÃ£</Text>
        <TextField
          icon="key-outline"
          placeholder="MÃ£ lá»›p"
          value={joinCode}
          onChangeText={setJoinCode}
          autoCapitalize="characters"
        />
        <PrimaryButton
          label={joining ? "Äang tham gia..." : "Tham gia lá»›p"}
          icon="people-outline"
          color={colors.green}
          onPress={joinClass}
          disabled={joining}
        />
      </Card>

      <SectionTitle title="TÃ i khoáº£n" />
      <Card style={styles.accountCard}>
        <Text style={styles.cardTitle}>PhiÃªn Ä‘Äƒng nháº­p</Text>
        <Text style={styles.cardSubtitle}>
          ÄÄƒng xuáº¥t khá»i thiáº¿t bá»‹ hiá»‡n táº¡i vÃ  quay láº¡i mÃ n Ä‘Äƒng nháº­p.
        </Text>
        <GhostButton label="ÄÄƒng xuáº¥t" icon="log-out-outline" onPress={logout} color={colors.red} />
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

