import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  count: number;
  best: number;
  reducedMotion?: boolean;
};

/** Large live count on an opaque pale backing. Pulses on each new skip. */
function SkipCounter({ count, best, reducedMotion = false }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const prev = useRef(count);

  useEffect(() => {
    if (count === prev.current) {
      return;
    }
    prev.current = count;
    if (reducedMotion) {
      return;
    }
    scale.setValue(1.05);
    Animated.spring(scale, {
      toValue: 1,
      tension: 140,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [count, reducedMotion, scale]);

  return (
    <View style={styles.root} accessible accessibilityLabel={String(count) + ' skips'}>
      <Animated.Text style={[styles.count, { transform: [{ scale }] }]}>
        {String(count)}
      </Animated.Text>
      <Text style={styles.label}>SKIPS</Text>
      {best > 0 ? <Text style={styles.best}>{'Best ' + String(best)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
    minWidth: 128,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.ui.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    ...theme.shadow.card,
  },
  count: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 2,
    color: theme.colors.text.secondary,
  },
  best: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginTop: 2,
    color: theme.colors.text.muted,
  },
});

export default React.memo(SkipCounter);
