import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import {
  Card,
  GhostButton,
  PrimaryButton,
  Screen,
  TextField
} from "../../components/ui/Primitives";
import { colors, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { login, authError, setAuthError } = useAuth();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    if (!username.trim() || !password) {
      setAuthError("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }
    setSubmitting(true);
    const result = await login(username, password);
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
      <Screen style={styles.screen}>
        <View style={styles.brand}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>Au</Text>
          </View>
          <Text style={styles.brandTitle}>AURUM</Text>
          <Text style={styles.brandSubtitle}>Chemistry Currency</Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Đăng nhập</Text>
          <Text style={styles.formSubtitle}>Mở lại lộ trình học, công cụ hỗ trợ và đấu trường của bạn.</Text>

          <TextField
            icon="person-outline"
            placeholder="Tên đăng nhập hoặc thư điện tử"
            value={username}
            onChangeText={setUsername}
            returnKeyType="next"
          />
          <TextField
            icon="lock-closed-outline"
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="go"
            onSubmitEditing={submit}
          />

          {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

          <PrimaryButton
            label={submitting ? "Đang đăng nhập..." : "Đăng nhập"}
            icon="log-in-outline"
            onPress={submit}
            disabled={submitting}
          />
          <Link href="/register" asChild>
            <GhostButton label="Tạo tài khoản học sinh" icon="person-add-outline" />
          </Link>
        </Card>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    minHeight: "100%"
  },
  brand: {
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.md
  },
  logoMark: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md
  },
  logoText: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900"
  },
  brandTitle: {
    color: colors.ink,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "900",
    fontStyle: "italic"
  },
  brandSubtitle: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  formCard: {
    gap: spacing.md
  },
  formTitle: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: "900"
  },
  formSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600"
  },
  errorText: {
    color: colors.red,
    fontSize: 13,
    fontWeight: "800"
  }
});
