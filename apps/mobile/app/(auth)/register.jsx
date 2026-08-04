import { isValidNewPassword, PASSWORD_POLICY_MESSAGE } from '../../../../shared/passwordPolicy';
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

const grades = ["6", "7", "8", "9", "10", "11", "12"];

export default function RegisterScreen() {
  const { register, authError, setAuthError } = useAuth();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [grade, setGrade] = React.useState("10");
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    if (!username.trim() || !email.trim() || !password) {
      setAuthError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (!isValidNewPassword(password)) {
      setAuthError(PASSWORD_POLICY_MESSAGE);
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
          <Text style={styles.title}>Tạo tài khoản học sinh</Text>
          <Text style={styles.subtitle}>Tài khoản mới sẽ liên kết ngay với hồ sơ học tập, điểm kinh nghiệm và chuỗi học.</Text>

          <TextField
            icon="person-outline"
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={setUsername}
          />
          <TextField
            icon="mail-outline"
            placeholder="Email"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
          <TextField
            icon="lock-closed-outline"
            placeholder="Mật khẩu"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />

          <View style={styles.gradeBlock}>
            <Text style={styles.gradeLabel}>Khối đang học</Text>
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
            label={submitting ? "Đang tạo..." : "Tạo tài khoản"}
            icon="sparkles-outline"
            onPress={submit}
            disabled={submitting}
          />
          <Link href="/login" asChild>
            <GhostButton label="Đã có tài khoản" icon="arrow-back-outline" />
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


