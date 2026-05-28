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
    title: "CÃ´ng cá»¥",
    subtitle: "Gá»£i Ã½ cÃ´ng thá»©c vÃ  mÃ¡y tÃ­nh hÃ³a há»c",
    icon: "construct-outline",
    color: colors.green,
    href: "/lab"
  },
  {
    title: "TÃ i liá»‡u",
    subtitle: "ThÆ° viá»‡n há»c liá»‡u vÃ  pháº£n há»“i",
    icon: "library-outline",
    color: colors.green,
    href: "/library"
  },
  {
    title: "Há»“ sÆ¡",
    subtitle: "TÃ i khoáº£n, kinh nghiá»‡m, chuá»—i há»c vÃ  káº¿ hoáº¡ch há»c",
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
        eyebrow="TrÃ¬nh Ä‘Æ¡n"
        title="ThÃªm"
        subtitle="CÃ¡c má»¥c phá»¥ Ä‘Æ°á»£c gom láº¡i Ä‘á»ƒ lá»›p há»c lÃ  trung tÃ¢m cá»§a á»©ng dá»¥ng."
        right={<Pill label={`Cáº¥p ${user?.level || 1}`} icon="sparkles-outline" color={colors.green} />}
      />

      <Card accent={colors.green} style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{String(user?.username || "A").charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>{user?.username || "Há»c sinh"}</Text>
          <Text style={styles.profileMeta}>{user?.email || "TÃ i khoáº£n AURUM"}</Text>
        </View>
      </Card>

      <View style={styles.metricRow}>
        <Metric label="Kinh nghiá»‡m" value={user?.xp || 0} icon="flash-outline" color={colors.green} />
        <Metric label="Chuá»—i há»c" value={user?.streakCount || 0} icon="flame-outline" color={colors.green} />
        <Metric label="Trá»±c tuyáº¿n" value={`${user?.todayOnlineMinutes || 0}p`} icon="time-outline" color={colors.green} />
      </View>

      <SectionTitle title="Lá»‘i táº¯t" />
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

      <SectionTitle title="TÃ i khoáº£n" />
      <ListRow
        icon="person-outline"
        title="Má»Ÿ há»“ sÆ¡ Ä‘áº§y Ä‘á»§"
        subtitle="Cáº­p nháº­t káº¿ hoáº¡ch há»c vÃ  tham gia lá»›p báº±ng mÃ£"
        color={colors.green}
        onPress={() => router.push("/profile")}
      />
      <GhostButton label="ÄÄƒng xuáº¥t" icon="log-out-outline" color={colors.red} onPress={logout} />
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


