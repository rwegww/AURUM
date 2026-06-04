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
      setAuthError("Vui lÃ²ng nháº­p tÃ i khoáº£n vÃ  máº­t kháº©u");
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
          <Text style={styles.formTitle}>ÄÄƒng nháº­p</Text>
          <Text style={styles.formSubtitle}>Má»Ÿ láº¡i lá»™ trÃ¬nh há»c, cÃ´ng cá»¥ há»— trá»£ vÃ  Ä‘áº¥u trÆ°á»ng cá»§a báº¡n.</Text>

          <TextField
            icon="person-outline"
            placeholder="TÃªn Ä‘Äƒng nháº­p hoáº·c thÆ° Ä‘iá»‡n tá»­"
            value={username}
            onChangeText={setUsername}
            returnKeyType="next"
          />
          <TextField
            icon="lock-closed-outline"
            placeholder="Máº­t kháº©u"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="go"
            onSubmitEditing={submit}
          />

          {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

          <PrimaryButton
            label={submitting ? "Äang Ä‘Äƒng nháº­p..." : "ÄÄƒng nháº­p"}
            icon="log-in-outline"
            onPress={submit}
            disabled={submitting}
          />
          <Link href="/register" asChild>
            <GhostButton label="Táº¡o tÃ i khoáº£n há»c sinh" icon="person-add-outline" />
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

