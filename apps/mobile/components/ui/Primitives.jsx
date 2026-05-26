import React from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadow, spacing } from "../../constants/theme";

export const Screen = ({ children, scroll = true, footer, style }) => {
  const content = (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : content}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
};

export const ScreenHeader = ({ eyebrow, title, subtitle, right, color = colors.green }) => (
  <View style={styles.header}>
    <View style={styles.headerText}>
      {eyebrow ? <Text style={[styles.eyebrow, { color }]}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {right ? <View style={styles.headerRight}>{right}</View> : null}
  </View>
);

export const Card = ({ children, style, accent }) => (
  <View style={[
    styles.card,
    accent ? { borderLeftWidth: 6, borderLeftColor: accent, paddingLeft: spacing.md - 2 } : null,
    style
  ]}>
    {children}
  </View>
);

export const PrimaryButton = ({
  label,
  icon,
  onPress,
  disabled,
  color = colors.green,
  textColor = "#ffffff",
  style
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.button,
      { backgroundColor: disabled ? "#c8d0c0" : color },
      pressed && !disabled ? styles.buttonPressed : null,
      style
    ]}
  >
    {icon ? <Ionicons name={icon} size={18} color={textColor} /> : null}
    <Text style={[styles.buttonText, { color: textColor }]} numberOfLines={1}>
      {label}
    </Text>
  </Pressable>
);

export const GhostButton = ({ label, icon, onPress, style, color = colors.ink }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.ghostButton,
      pressed ? styles.ghostPressed : null,
      style
    ]}
  >
    {icon ? <Ionicons name={icon} size={18} color={color} /> : null}
    <Text style={[styles.ghostButtonText, { color }]} numberOfLines={1}>
      {label}
    </Text>
  </Pressable>
);

export const IconButton = ({ icon, onPress, color = colors.ink, background = "#ffffff" }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.iconButton,
      { backgroundColor: background },
      pressed ? { transform: [{ scale: 0.96 }] } : null
    ]}
  >
    <Ionicons name={icon} size={20} color={color} />
  </Pressable>
);

export const Pill = ({ label, color = colors.green, icon }) => (
  <View style={[styles.pill, { backgroundColor: `${color}18` }]}>
    {icon ? <Ionicons name={icon} size={13} color={colors.greenDark} /> : null}
    <Text style={[styles.pillText, { color: colors.greenDark }]} numberOfLines={1}>{label}</Text>
  </View>
);

export const Metric = ({ label, value, color = colors.green, icon }) => (
  <View style={styles.metric}>
    <View style={[styles.metricIcon, { backgroundColor: `${color}18` }]}>
      <Ionicons name={icon || "sparkles"} size={18} color={color} />
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel} numberOfLines={1}>{label}</Text>
  </View>
);

export const SectionTitle = ({ title, actionLabel, onAction, color = colors.green }) => (
  <View style={styles.sectionTitle}>
    <Text style={styles.sectionTitleText}>{title}</Text>
    {actionLabel ? (
      <Pressable onPress={onAction} style={styles.sectionAction}>
        <Text style={[styles.sectionActionText, { color }]}>{actionLabel}</Text>
        <Ionicons name="chevron-forward" size={14} color={color} />
      </Pressable>
    ) : null}
  </View>
);

export const TextField = ({ icon, style, ...props }) => (
  <View style={[styles.inputWrap, style]}>
    {icon ? <Ionicons name={icon} size={18} color={colors.muted} /> : null}
    <TextInput
      placeholderTextColor="#98a2b3"
      autoCapitalize="none"
      style={styles.input}
      {...props}
    />
  </View>
);

export const ProgressBar = ({ value = 0, color = colors.green }) => {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${clamped * 100}%`, backgroundColor: color }]} />
    </View>
  );
};

export const LoadingState = ({ label = "Đang tải dữ liệu..." }) => (
  <View style={styles.state}>
    <ActivityIndicator color={colors.green} size="large" />
    <Text style={styles.stateText}>{label}</Text>
  </View>
);

export const EmptyState = ({ icon = "flask-outline", title, subtitle, action }) => (
  <Card style={styles.emptyState}>
    <View style={styles.emptyIcon}>
      <Ionicons name={icon} size={28} color={colors.green} />
    </View>
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    {action ? <View style={styles.emptyAction}>{action}</View> : null}
  </Card>
);

export const ErrorState = ({ message, onRetry }) => (
  <EmptyState
    icon="warning-outline"
    title="Không tải được dữ liệu"
    subtitle={message}
    action={onRetry ? <PrimaryButton label="Thử lại" icon="refresh" onPress={onRetry} /> : null}
  />
);

export const ListRow = ({ icon, title, subtitle, right, onPress, color = colors.green }) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    style={({ pressed }) => [
      styles.listRow,
      pressed ? { backgroundColor: colors.surfaceAlt } : null
    ]}
  >
    <View style={[styles.rowIcon, { backgroundColor: `${color}18` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.rowText}>
      <Text style={styles.rowTitle} numberOfLines={2}>{title}</Text>
      {subtitle ? <Text style={styles.rowSubtitle} numberOfLines={2}>{subtitle}</Text> : null}
    </View>
    {right || (onPress ? <Ionicons name="chevron-forward" size={18} color="#98a2b3" /> : null)}
  </Pressable>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg
  },
  scrollContent: {
    paddingBottom: 32
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.md
  },
  footer: {
    backgroundColor: colors.bg,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    padding: spacing.md
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md
  },
  headerText: {
    flex: 1,
    gap: 5
  },
  headerRight: {
    marginTop: 4
  },
  eyebrow: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600"
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow
  },
  button: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 4,
    borderBottomColor: "rgba(0,0,0,0.15)",
  },
  buttonPressed: {
    transform: [{ translateY: 4 }],
    borderBottomWidth: 0,
    marginTop: 4,
    opacity: 0.95
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    flexShrink: 1
  },
  ghostButton: {
    minHeight: 48,
    borderRadius: radius.md,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md
  },
  ghostPressed: {
    backgroundColor: colors.surfaceAlt
  },
  ghostButtonText: {
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    flexShrink: 1
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    ...shadow
  },
  pill: {
    alignSelf: "flex-start",
    minHeight: 28,
    borderRadius: 999,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  pillText: {
    fontSize: 12,
    fontWeight: "900"
  },
  metric: {
    flex: 1,
    minWidth: 96,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 6
  },
  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  metricValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  sectionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: 4
  },
  sectionTitleText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  sectionAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2
  },
  sectionActionText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "900"
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: radius.md,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontWeight: "700"
  },
  progressTrack: {
    height: 9,
    borderRadius: 999,
    backgroundColor: "#edf2e8",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999
  },
  state: {
    flex: 1,
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xl
  },
  stateText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center"
  },
  emptyState: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xl
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center"
  },
  emptySubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    textAlign: "center"
  },
  emptyAction: {
    marginTop: spacing.sm,
    width: "100%"
  },
  listRow: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  rowText: {
    flex: 1,
    gap: 3
  },
  rowTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  rowSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  }
});

