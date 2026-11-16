import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ANIM } from '../constants/config';
import theme from '../constants/theme';
import { resultHeadline } from '../game/progression';

type Props = {
  skips: number;
  lakeName: string;
  previousBest: number | null;
  newRecord: boolean;
  matched: boolean;
  hint: string;
  reducedMotion?: boolean;
};

/** Large centred result. The bounce runs once, on a new record only. */
function ResultCard({
  skips,
  lakeName,
  previousBest,
  newRecord,
  matched,
  hint,
  reducedMotion = false,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!newRecord || reducedMotion) {
      return;
    }
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.06, duration: ANIM.bounce / 2, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: ANIM.bounce / 2, useNativeDriver: true }),
    ]).start();
  }, [newRecord, reducedMotion, scale]);

  const bestText =
    previousBest !== null && previousBest > 0
      ? 'Previous best ' + String(previousBest) + ' skips'
      : 'First completed throw here';

  return (
    <View style={styles.card}>
      {newRecord ? (
        <View style={styles.ribbon}>
          <Text style={styles.ribbonText}>NEW RECORD</Text>
        </View>
      ) : null}
      {matched && !newRecord ? (
        <Text style={styles.matched} numberOfLines={1}>
          Matched your best
        </Text>
      ) : null}
      <Animated.Text style={[styles.count, { transform: [{ scale }] }]} numberOfLines={1}>
        {String(skips)}
      </Animated.Text>
      <Text style={styles.headline} numberOfLines={2}>
        {resultHeadline(skips)}
      </Text>
      <Text style={styles.lake} numberOfLines={1}>
        {lakeName}
      </Text>
      <Text style={styles.best} numberOfLines={1}>
        {bestText}
      </Text>
      <View style={styles.divider} />
      <Text style={styles.hint} numberOfLines={2}>
        {hint}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.surface,
    ...theme.shadow.card,
  },
  ribbon: {
    paddingHorizontal: 12,
    height: 26,
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.lake.green,
    marginBottom: 6,
  },
  ribbonText: {
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    letterSpacing: 1.6,
    color: theme.colors.text.primary,
  },
  matched: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginBottom: 4,
    color: theme.colors.text.secondary,
  },
  count: {
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 64,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  headline: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  lake: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
    marginTop: 2,
    color: theme.colors.text.secondary,
  },
  best: { fontSize: 13, fontWeight: '500', lineHeight: 18, color: theme.colors.text.muted },
  divider: {
    width: '70%',
    height: 1,
    marginVertical: 10,
    backgroundColor: theme.colors.ui.border,
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
});

export default React.memo(ResultCard);
