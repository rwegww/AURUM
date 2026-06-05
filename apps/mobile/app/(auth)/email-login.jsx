import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, Image } from "react-native";
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

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function EmailLoginScreen() {
  const { requestEmailOtp, verifyEmailOtp, authError, setAuthError } = useAuth();
  const [step, setStep] = React.useState("email");
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [infoMessage, setInfoMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setAuthError(null);
    return () => setAuthError(null);
  }, [setAuthError]);

  const requestOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setAuthError("Vui lòng nhập email hợp lệ");
      return;
    }

    setSubmitting(true);
    setInfoMessage("");
    const result = await requestEmailOtp(normalizedEmail);
    setSubmitting(false);

    if (!result.success) return;

    setEmail(normalizedEmail);
    setOtp("");
    setStep("otp");
    setInfoMessage(
      result.previewUrl
        ? "Mã OTP đã được gửi. Khi chạy thử, bạn có thể mở email xem trước từ log máy chủ."
        : "Mã OTP đã được gửi nếu email này thuộc tài khoản AURUM."
    );
  };

  const verifyOtp = async () => {
    const normalizedOtp = otp.replace(/\s/g, "");
    if (!/^\d{6}$/.test(normalizedOtp)) {
      setAuthError("Mã OTP phải gồm 6 chữ số");
      return;
    }

    setSubmitting(true);
    const result = await verifyEmailOtp(email, normalizedOtp);
    setSubmitting(false);

    if (result.success) {
      router.replace("/");
    }
  };

  const changeEmail = () => {
    setStep("email");
    setOtp("");
    setInfoMessage("");
    setAuthError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1 }}
    >
      <Screen style={styles.screen}>
        <View style={styles.brand}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.brandTitle}>AURUM</Text>
          <Text style={styles.brandSubtitle}>Chemistry Currency</Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Đăng nhập bằng email</Text>
          <Text style={styles.formSubtitle}>
            {step === "email"
              ? "Nhập email đã đăng ký để nhận mã xác thực một lần."
              : `Nhập mã 6 chữ số đã gửi tới ${email}`}
          </Text>

          {step === "email" ? (
            <TextField
              icon="mail-outline"
              placeholder="Email"
              value={email}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="send"
              onChangeText={setEmail}
              onSubmitEditing={requestOtp}
            />
          ) : (
            <TextField
              icon="keypad-outline"
              placeholder="Mã OTP"
              value={otp}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              maxLength={6}
              returnKeyType="go"
              onChangeText={(value) => setOtp(value.replace(/[^\d]/g, ""))}
              onSubmitEditing={verifyOtp}
            />
          )}

          {infoMessage ? <Text style={styles.infoText}>{infoMessage}</Text> : null}
          {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

          {step === "email" ? (
            <PrimaryButton
              label={submitting ? "Đang gửi mã..." : "Gửi mã OTP"}
              icon="mail-open-outline"
              onPress={requestOtp}
              disabled={submitting}
            />
          ) : (
            <>
              <PrimaryButton
                label={submitting ? "Đang xác thực..." : "Xác thực OTP"}
                icon="checkmark-circle-outline"
                onPress={verifyOtp}
                disabled={submitting}
              />
              <View style={styles.otpActions}>
                <GhostButton
                  label="Gửi lại mã"
                  icon="refresh-outline"
                  onPress={requestOtp}
                  disabled={submitting}
                  style={styles.otpAction}
                />
                <GhostButton
                  label="Đổi email"
                  icon="create-outline"
                  onPress={changeEmail}
                  disabled={submitting}
                  style={styles.otpAction}
                />
              </View>
            </>
          )}

          <Link href="/login" asChild>
            <GhostButton label="Quay lại đăng nhập" icon="arrow-back-outline" />
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
  logoImage: {
    width: 82,
    height: 82,
    marginBottom: spacing.md
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
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "900"
  },
  formSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600"
  },
  otpActions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  otpAction: {
    flex: 1
  },
  infoText: {
    color: colors.greenDark,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800"
  },
  errorText: {
    color: colors.red,
    fontSize: 13,
    fontWeight: "800"
  }
});
