import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import { Bell, BookOpen, FlaskConical, GraduationCap, Home, LogOut, Shield, UserRound } from 'lucide-react-native';
import { colors, font, radius, spacing } from '@/theme';
import { useAuth } from '@/auth/AuthProvider';

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
};

const studentNav: NavItem[] = [
  { label: 'Nhà', href: '/', icon: Home },
  { label: 'Bài học', href: '/lessons', icon: BookOpen },
  { label: 'Lab', href: '/lab', icon: FlaskConical },
  { label: 'Hồ sơ', href: '/profile', icon: UserRound },
];

const teacherNav: NavItem[] = [
  { label: 'Tổng quan', href: '/teacher', icon: Home },
  { label: 'Lớp', href: '/teacher/classes', icon: GraduationCap },
  { label: 'Bài giao', href: '/teacher/assignments', icon: BookOpen },
];

const adminNav: NavItem[] = [
  { label: 'Admin', href: '/admin', icon: Shield },
  { label: 'Người dùng', href: '/admin/users', icon: UserRound },
  { label: 'Duyệt', href: '/admin/feedback', icon: Bell },
];

const getNavItems = (role?: string | null) => {
  if (role === 'admin') return adminNav;
  if (role === 'teacher') return teacherNav;
  return studentNav;
};

export const AppScreen = ({
  title,
  subtitle,
  children,
  scroll = true,
  dark = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  scroll?: boolean;
  dark?: boolean;
}) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const navItems = getNavItems(user?.role);
  const Content = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safe, dark && styles.darkSafe]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, dark && styles.darkHeader]}>
        <View style={styles.brandMark}>
          <Text style={styles.brandText}>Au</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, dark && styles.darkText]} numberOfLines={2}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, dark && styles.darkMuted]} numberOfLines={2}>{subtitle}</Text> : null}
        </View>
        <Pressable accessibilityRole="button" onPress={logout} style={styles.iconButton}>
          <LogOut size={20} color={dark ? '#fff' : colors.muted} />
        </Pressable>
      </View>

      <Content
        style={styles.content}
        contentContainerStyle={scroll ? styles.contentContainer : undefined}
      >
        {children}
      </Content>

      <View style={[styles.nav, dark && styles.darkNav]}>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Pressable key={item.href} onPress={() => router.push(item.href as never)} style={[styles.navItem, active && styles.navActive]}>
              <Icon size={19} color={active ? colors.green : colors.muted} />
              <Text style={[styles.navLabel, active && styles.navLabelActive]} numberOfLines={1}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  darkSafe: {
    backgroundColor: colors.labBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg,
  },
  darkHeader: {
    backgroundColor: colors.labBg,
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: '#fff',
    fontWeight: font.heavy,
    fontSize: 17,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: font.heavy,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: font.medium,
  },
  darkText: {
    color: '#fff',
  },
  darkMuted: {
    color: 'rgba(255,255,255,0.62)',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 108,
    gap: spacing.md,
  },
  nav: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    minHeight: 64,
    borderRadius: radius.xl,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  darkNav: {
    backgroundColor: colors.labCard,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  navItem: {
    flex: 1,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    gap: 3,
  },
  navActive: {
    backgroundColor: 'rgba(118,192,52,0.1)',
  },
  navLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: font.heavy,
  },
  navLabelActive: {
    color: colors.green,
  },
});
