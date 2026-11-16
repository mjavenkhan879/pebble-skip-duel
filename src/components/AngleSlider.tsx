import React, { useCallback, useMemo, useRef } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, Text, View } from 'react-native';
import { ANGLE_MAX, ANGLE_MIN } from '../constants/config';
import theme from '../constants/theme';
import { clamp } from '../utils/format';

const MARKS = [10, 20, 30];
const THUMB = 26;

type Props = {
  value: number;
  disabled?: boolean;
  onChange: (deg: number) => void;
};

/** One-degree angle control on a 48dp touch track. */
function AngleSlider({ value, disabled = false, onChange }: Props) {
  const widthRef = useRef(1);
  const disabledRef = useRef(disabled);
  const changeRef = useRef(onChange);
  disabledRef.current = disabled;
  changeRef.current = onChange;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    widthRef.current = Math.max(1, e.nativeEvent.layout.width);
  }, []);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabledRef.current,
        onMoveShouldSetPanResponder: () => !disabledRef.current,
        onPanResponderGrant: evt => {
          if (disabledRef.current) {
            return;
          }
          const ratio = clamp(evt.nativeEvent.locationX / widthRef.current, 0, 1);
          changeRef.current(Math.round(ANGLE_MIN + ratio * (ANGLE_MAX - ANGLE_MIN)));
        },
        onPanResponderMove: evt => {
          if (disabledRef.current) {
            return;
          }
          const ratio = clamp(evt.nativeEvent.locationX / widthRef.current, 0, 1);
          changeRef.current(Math.round(ANGLE_MIN + ratio * (ANGLE_MAX - ANGLE_MIN)));
        },
      }),
    [],
  );

  const ratio = (clamp(value, ANGLE_MIN, ANGLE_MAX) - ANGLE_MIN) / (ANGLE_MAX - ANGLE_MIN);

  return (
    <View style={styles.root}>
      <Text style={styles.heading} numberOfLines={1}>
        {'Angle ' + String(value) + ' degrees'}
      </Text>
      <View
        style={[styles.track, disabled ? styles.disabled : null]}
        onLayout={onLayout}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Throw angle"
        accessibilityValue={{ min: ANGLE_MIN, max: ANGLE_MAX, now: value }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={e => {
          if (disabled) {
            return;
          }
          const step = e.nativeEvent.actionName === 'increment' ? 1 : -1;
          onChange(clamp(value + step, ANGLE_MIN, ANGLE_MAX));
        }}
        {...responder.panHandlers}>
        <View style={styles.rail} />
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
        {MARKS.map(m => (
          <View
            key={m}
            pointerEvents="none"
            style={[
              styles.mark,
              { left: `${((m - ANGLE_MIN) / (ANGLE_MAX - ANGLE_MIN)) * 100}%` },
            ]}
          />
        ))}
        <View
          pointerEvents="none"
          style={[styles.thumbWrap, { left: `${ratio * 100}%` }]}>
          <View style={styles.thumb} />
        </View>
      </View>
      <View style={styles.scale}>
        <Text style={styles.scaleText}>{String(ANGLE_MIN)}</Text>
        <Text style={styles.scaleText}>20</Text>
        <Text style={styles.scaleText}>{String(ANGLE_MAX)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%' },
  heading: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  track: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
  },
  disabled: { opacity: 0.48 },
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
  mark: {
    position: 'absolute',
    width: 2,
    height: 14,
    marginLeft: -1,
    borderRadius: 1,
    backgroundColor: theme.colors.ui.track,
    opacity: 0.5,
  },
  thumbWrap: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    marginLeft: -THUMB / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: theme.colors.lake.purple,
    borderWidth: 2,
    borderColor: theme.colors.text.primary,
  },
  scale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -2 },
  scaleText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    color: theme.colors.text.muted,
  },
});

export default React.memo(AngleSlider);
