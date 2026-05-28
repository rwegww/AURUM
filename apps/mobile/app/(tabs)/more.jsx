import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  GhostButton,
  ListRow,
  Metric,
  Pill,
  Screen,
  ScreenHeader,
  SectionTitle
} from "../../components/ui/Primitives";
import { colors, radius, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    title: "Công cụ",
    subtitle: "Gợi ý công thức và máy tính hóa học",
    icon: "construct-outline",
    color: colors.green,
    href: "/lab"
  },
  {
    title: "Tài liệu",
    subtitle: "Thư viện học liệu và phản hồi",
    icon: "library-outline",
    color: colors.green,
    href: "/library"
  },
  {
    title: "Hồ sơ",
    subtitle: "Tài khoản, kinh nghiệm, chuỗi học và kế hoạch học",
    icon: "person-circle-outline",
    color: colors.green,
    href: "/profile"
  }
];

export default function MoreTab() {
  const { user, logout } = useAuth();

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Trình đơn"
        title="Thêm"
        subtitle="Các mục phụ được gom lại để lớp học là trung tâm của ứng dụng."
        right={<Pill label={`Cấp ${user?.level || 1}`} icon="sparkles-outline" color={colors.green} />}
      />

      <Card accent={colors.green} style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{String(user?.username || "A").charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>{user?.username || "Học sinh"}</Text>
          <Text style={styles.profileMeta}>{user?.email || "Tài khoản AURUM"}</Text>
        </View>
      </Card>

      <View style={styles.metricRow}>
        <Metric label="Kinh nghiệm" value={user?.xp || 0} icon="flash-outline" color={colors.green} />
        <Metric label="Chuỗi học" value={user?.streakCount || 0} icon="flame-outline" color={colors.green} />
        <Metric label="Trực tuyến" value={`${user?.todayOnlineMinutes || 0}p`} icon="time-outline" color={colors.green} />
      </View>

      <SectionTitle title="Lối tắt" />
      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href)}
            style={({ pressed }) => [
              styles.menuCard,
              pressed ? { transform: [{ translateY: 2 }] } : null
            ]}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}18` }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle title="Tài khoản" />
      <ListRow
        icon="person-outline"
        title="Mở hồ sơ đầy đủ"
        subtitle="Cập nhật kế hoạch học và tham gia lớp bằng mã"
        color={colors.green}
        onPress={() => router.push("/profile")}
      />
      <GhostButton label="Đăng xuất" icon="log-out-outline" color={colors.red} onPress={logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900"
  },
  profileCopy: {
    flex: 1,
    gap: 4
  },
  profileName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  profileMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  menuGrid: {
    gap: spacing.sm
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 112,
    gap: spacing.sm
  },
  menuIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  menuTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  menuSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  }
});


