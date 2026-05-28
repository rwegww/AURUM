import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import {
  Card,
  GhostButton,
  PrimaryButton,
  Screen,
  TextField
} from "../../components/ui/Primitives";
import { colors, radius, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

const grades = ["8", "9", "10", "11", "12"];

export default function RegisterScreen() {
  const { register, authError, setAuthError } = useAuth();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [grade, setGrade] = React.useState("10");
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    if (!username.trim() || !email.trim() || !password) {
      setAuthError("Vui lÃ²ng nháº­p Ä‘áº§y Ä‘á»§ thÃ´ng tin");
      return;
    }
    if (password.length < 6) {
      setAuthError("Máº­t kháº©u cáº§n tá»‘i thiá»ƒu 6 kÃ½ tá»±");
      return;
    }

    setSubmitting(true);
    const result = await register({ username, email, password, grade });
    setSubmitting(false);
    if (result.success) {
      router.replace("/");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1 }}
    >
      <Screen>
        <Card style={styles.formCard}>
          <Text style={styles.title}>Táº¡o tÃ i khoáº£n há»c sinh</Text>
          <Text style={styles.subtitle}>TÃ i khoáº£n má»›i sáº½ Ä‘Æ°á»£c ná»‘i ngay vá»›i há»“ sÆ¡ há»c táº­p, Ä‘iá»ƒm kinh nghiá»‡m vÃ  chuá»—i há»c.</Text>

          <TextField
            icon="person-outline"
            placeholder="TÃªn Ä‘Äƒng nháº­p"
            value={username}
            onChangeText={setUsername}
          />
          <TextField
            icon="mail-outline"
            placeholder="ThÆ° Ä‘iá»‡n tá»­"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
          <TextField
            icon="lock-closed-outline"
            placeholder="Máº­t kháº©u"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />

          <View style={styles.gradeBlock}>
            <Text style={styles.gradeLabel}>Khá»‘i Ä‘ang há»c</Text>
            <View style={styles.gradeRow}>
              {grades.map((item) => {
                const selected = item === grade;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setGrade(item)}
                    style={[styles.gradeChip, selected ? styles.gradeChipActive : null]}
                  >
                    <Text style={[styles.gradeText, selected ? styles.gradeTextActive : null]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

          <PrimaryButton
            label={submitting ? "Äang táº¡o..." : "Táº¡o tÃ i khoáº£n"}
            icon="sparkles-outline"
            onPress={submit}
            disabled={submitting}
          />
          <Link href="/login" asChild>
            <GhostButton label="ÄÃ£ cÃ³ tÃ i khoáº£n" icon="arrow-back-outline" />
          </Link>
        </Card>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formCard: {
    marginTop: spacing.xl,
    gap: spacing.md
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600"
  },
  gradeBlock: {
    gap: spacing.sm
  },
  gradeLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900"
  },
  gradeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  gradeChip: {
    width: 48,
    height: 44,
    borderRadius: radius.md,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center"
  },
  gradeChipActive: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  gradeText: {
    color: colors.ink,
    fontWeight: "900"
  },
  gradeTextActive: {
    color: "#ffffff"
  },
  errorText: {
    color: colors.red,
    fontSize: 13,
    fontWeight: "800"
  }
});


