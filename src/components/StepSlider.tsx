import React, { useCallback, useMemo, useRef } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { clamp } from '../utils/format';

type Props = {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

/** Generic 48dp announced slider track used inside the throw controls modal. */
function StepSlider({ label, unit, value, min, max, step, onChange }: Props) {
  const widthRef = useRef(1);
  const changeRef = useRef(onChange);
  const boundsRef = useRef({ min, max, step });
  changeRef.current = onChange;
  boundsRef.current = { min, max, step };

  const onLayout = useCallback((ev: LayoutChangeEvent) => {
    widthRef.current = Math.max(1, ev.nativeEvent.layout.width);
  }, []);

  const apply = useCallback((locationX: number) => {
    const b = boundsRef.current;
    const ratio = clamp(locationX / widthRef.current, 0, 1);
    const raw = b.min + ratio * (b.max - b.min);
    const snapped = Math.round(raw / b.step) * b.step;
    changeRef.current(clamp(snapped, b.min, b.max));
  }, []);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: ev => apply(ev.nativeEvent.locationX),
        onPanResponderMove: ev => apply(ev.nativeEvent.locationX),
      }),
    [apply],
  );

  const ratio = (clamp(value, min, max) - min) / Math.max(1, max - min);

  return (
    <View style={styles.root}>
      <Text style={styles.label} numberOfLines={1}>
        {label + ' ' + String(value) + unit}
      </Text>
      <View
        style={styles.track}
        onLayout={onLayout}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={ev => {
          const delta = ev.nativeEvent.actionName === 'increment' ? step : -step;
          onChange(clamp(value + delta, min, max));
        }}
        {...responder.panHandlers}>
        <View style={styles.rail} />
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
        <View pointerEvents="none" style={[styles.thumbWrap, { left: `${ratio * 100}%` }]}>
          <View style={styles.thumb} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%' },
  label: { fontSize: 13, fontWeight: '700', lineHeight: 18, color: theme.colors.text.primary },
  track: { width: '100%', height: 48, justifyContent: 'center' },
  rail: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.ui.track,
    opacity: 0.35,
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.lake.green,
  },
  thumbWrap: {
    position: 'absolute',
    width: 26,
    height: 26,
    marginLeft: -13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.lake.purple,
    borderWidth: 2,
    borderColor: theme.colors.text.primary,
  },
});

export default React.memo(StepSlider);
