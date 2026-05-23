import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Card, EmptyState, Tag } from './Primitives';
import { colors, font, spacing } from '@/theme';

type Entity = Record<string, unknown>;

const pick = (item: Entity, keys: string[], fallback = '') => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'string' || typeof value === 'number') return String(value);
  }
  return fallback;
};

export const EntityList = ({
  items,
  titleKeys = ['title', 'name', 'username', 'email', 'id'],
  subtitleKeys = ['description', 'email', 'role', 'grade', 'code'],
  tagKey,
  emptyTitle = 'Chưa có dữ liệu',
  onPress,
}: {
  items: Entity[];
  titleKeys?: string[];
  subtitleKeys?: string[];
  tagKey?: string;
  emptyTitle?: string;
  onPress?: (item: Entity) => void;
}) => {
  if (!items?.length) return <EmptyState title={emptyTitle} body="Dữ liệu sẽ xuất hiện khi API trả về nội dung." />;

  return (
    <View style={styles.list}>
      {items.map((item, index) => {
        const title = pick(item, titleKeys, `Mục ${index + 1}`);
        const subtitle = pick(item, subtitleKeys);
        const tag = tagKey ? pick(item, [tagKey]) : '';
        return (
          <Pressable key={String(item.id || item.lessonId || index)} onPress={() => onPress?.(item)}>
            <Card>
              <View style={styles.row}>
                <View style={styles.textWrap}>
                  {tag ? <Tag tone="muted">{tag}</Tag> : null}
                  <Text style={styles.itemTitle}>{title}</Text>
                  {subtitle ? <Text style={styles.itemSubtitle} numberOfLines={2}>{subtitle}</Text> : null}
                </View>
                {onPress ? <ChevronRight size={20} color={colors.muted} /> : null}
              </View>
            </Card>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textWrap: {
    flex: 1,
    gap: 5,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: font.heavy,
  },
  itemSubtitle: {
    color: colors.muted,
    lineHeight: 19,
    fontWeight: font.medium,
  },
});
