import React, { useCallback, useMemo, useRef } from 'react';
import { LayoutChangeEvent, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { clamp, timeLabel } from '../utils/format';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  elapsedMs: number;
  durationMs: number;
  speed: number;
  playing: boolean;
  onSeek: (ms: number) => void;
  onSpeedChange: (speed: number) => void;
  onToggle: () => void;
};

/** Transport with a 48dp touch region over a 6dp visible track. */
function ReplayControls({
  elapsedMs,
  durationMs,
  speed,
  playing,
  onSeek,
  onSpeedChange,
  onToggle,
}: Props) {
  const widthRef = useRef(1);
  const seekRef = useRef(onSeek);
  const durationRef = useRef(durationMs);
  seekRef.current = onSeek;
  durationRef.current = durationMs;

  const onLayout = useCallback((ev: LayoutChangeEvent) => {
    widthRef.current = Math.max(1, ev.nativeEvent.layout.width);
  }, []);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: ev =>
          seekRef.current(
            clamp(ev.nativeEvent.locationX / widthRef.current, 0, 1) * durationRef.current,
          ),
        onPanResponderMove: ev =>
          seekRef.current(
            clamp(ev.nativeEvent.locationX / widthRef.current, 0, 1) * durationRef.current,
          ),
      }),
    [],
  );

  const ratio = durationMs > 0 ? clamp(elapsedMs / durationMs, 0, 1) : 0;

  return (
    <View style={styles.root}>
      <View
        style={styles.touch}
        onLayout={onLayout}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Replay position"
        {...responder.panHandlers}>
        <View style={styles.rail} />
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
      </View>
      <View style={styles.row}>
        <Text style={styles.time} numberOfLines={1}>
          {timeLabel(elapsedMs) + ' / ' + timeLabel(durationMs)}
        </Text>
        <View style={styles.buttons}>
          <Pressable
            onPress={onToggle}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel={playing ? 'Pause replay' : 'Resume replay'}
            style={styles.chip}>
            <Text style={styles.chipText}>{playing ? 'PAUSE' : 'RESUME'}</Text>
          </Pressable>
          {[0.5, 1].map(s => (
            <Pressable
              key={'speed' + String(s)}
              onPress={() => onSpeedChange(s)}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityState={{ selected: speed === s }}
              accessibilityLabel={'Speed ' + String(s) + ' times'}
              style={[styles.chip, styles.chipSmall, speed === s ? styles.chipActive : null]}>
              <Text style={[styles.chipText, speed === s ? styles.chipTextActive : null]}>
                {String(s) + 'x'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%', gap: 4 },
  touch: { width: '100%', height: 48, justifyContent: 'center' },
  rail: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.ui.track,
    opacity: 0.3,
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.lake.purple,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  time: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 24,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  buttons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chip: {
    height: 48,
    minWidth: 82,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderCool,
    backgroundColor: theme.colors.ui.surface,
  },
  chipSmall: { minWidth: 56 },
  chipActive: {
    backgroundColor: theme.colors.bg.tertiary,
    borderColor: theme.colors.lake.green,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 24,
    color: theme.colors.text.secondary,
  },
  chipTextActive: { color: theme.colors.text.primary },
});

export default React.memo(ReplayControls);
