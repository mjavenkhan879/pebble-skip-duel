import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Lock } from 'lucide-react-native';
import { Lake } from '../constants/lakes';
import { LakeRecord } from '../game/types';
import theme from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  lake: Lake;
  record?: LakeRecord;
  unlocked: boolean;
  onPress: (lakeId: number) => void;
};

/** 72dp pale raised row. Row tap selects the lake and returns to Lakeside. */
function RecordRow({ lake, record, unlocked, onPress }: Props) {
  const best = record && record.attempts > 0 ? 'Best ' + String(record.best) + ' skips' : 'No throw yet';
  const holder = record && record.attempts > 0 ? record.holder : '';
  return (
    <Pressable
      onPress={() => onPress(lake.id)}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={lake.name + ', ' + best}
      style={styles.row}>
      <View style={styles.num}>
        <Text style={styles.numText}>{String(lake.id)}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {lake.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {best + (holder ? '  ·  ' + holder : '')}
        </Text>
      </View>
      <View style={styles.tail}>
        <View style={styles.iconBox}>
          {unlocked ? (
            <Check size={24} color={theme.colors.lake.green} strokeWidth={2.5} />
          ) : (
            <Lock size={24} color={theme.colors.text.muted} strokeWidth={2} />
          )}
        </View>
        <Text style={styles.target} numberOfLines={1}>
          {'Target ' + String(lake.target)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.surface,
    ...theme.shadow.card,
  },
  num: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.tertiary,
  },
  numText: { fontSize: 15, fontWeight: '800', lineHeight: 20, color: theme.colors.text.primary },
  body: { flex: 1, paddingHorizontal: 10 },
  name: { fontSize: 16, fontWeight: '700', lineHeight: 22, color: theme.colors.text.primary },
  meta: { fontSize: 12, fontWeight: '500', lineHeight: 16, color: theme.colors.text.muted },
  tail: { width: 72, alignItems: 'center' },
  iconBox: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  target: { fontSize: 11, fontWeight: '700', lineHeight: 14, color: theme.colors.text.secondary },
});

export default React.memo(RecordRow);
