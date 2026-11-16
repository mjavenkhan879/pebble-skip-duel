import React, { useMemo, useRef, useState } from 'react';
import { Image, PanResponder, StyleSheet, Text, View } from 'react-native';
import { POWER_DEFAULT, SWIPE_ZONE_H } from '../constants/config';
import theme from '../constants/theme';
import assets from '../assets';
import { readSwipe } from '../game/throwInput';

type Props = {
  disabled: boolean;
  hint: string;
  onCommit: (heading: number, power: number) => void;
  onInvalid: (message: string) => void;
};

/**
 * Core responder swipe capture. A flick anywhere inside the zone throws — the
 * initial touch never has to land on the pebble preview. No gesture-handler.
 */
function SwipeZone({ disabled, hint, onCommit, onInvalid }: Props) {
  const startRef = useRef({ x: 0, y: 0, t: 0 });
  const disabledRef = useRef(disabled);
  const commitRef = useRef(onCommit);
  const invalidRef = useRef(onInvalid);
  const [active, setActive] = useState(false);

  disabledRef.current = disabled;
  commitRef.current = onCommit;
  invalidRef.current = onInvalid;

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabledRef.current,
        onMoveShouldSetPanResponder: () => !disabledRef.current,
        onPanResponderGrant: evt => {
          if (disabledRef.current) {
            return;
          }
          startRef.current = {
            x: evt.nativeEvent.pageX,
            y: evt.nativeEvent.pageY,
            t: Date.now(),
          };
          setActive(true);
        },
        onPanResponderRelease: evt => {
          setActive(false);
          if (disabledRef.current || startRef.current.t === 0) {
            return;
          }
          const dx = evt.nativeEvent.pageX - startRef.current.x;
          const up = startRef.current.y - evt.nativeEvent.pageY;
          const durationMs = Date.now() - startRef.current.t;
          startRef.current = { x: 0, y: 0, t: 0 };
          // A deliberate tap throws with the documented control defaults
          // (centred heading, 70% power) so the zone works one-handed too.
          if (Math.abs(dx) < 12 && Math.abs(up) < 12 && durationMs < 300) {
            commitRef.current(0, POWER_DEFAULT / 100);
            return;
          }
          const verdict = readSwipe({ dx, up, durationMs });
          if (verdict.ok) {
            commitRef.current(verdict.heading, verdict.power);
          } else {
            invalidRef.current(verdict.message);
          }
        },
        onPanResponderTerminate: () => {
          setActive(false);
          startRef.current = { x: 0, y: 0, t: 0 };
        },
      }),
    [],
  );

  return (
    <View style={styles.wrap}>
      <View
        style={[styles.zone, disabled ? styles.zoneOff : null, active ? styles.zoneOn : null]}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={hint}
        accessibilityHint="Flick upward inside this area to throw"
        {...responder.panHandlers}>
        <Text style={styles.hint} numberOfLines={1}>
          {hint}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          Tap to throw, or flick faster for power
        </Text>
        <Image source={assets.spritePebble} style={styles.pebble} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  zone: {
    width: '100%',
    height: SWIPE_ZONE_H,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.ui.surfaceCool,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.lake.deep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  zoneOn: { borderColor: theme.colors.lake.purple, backgroundColor: theme.colors.bg.tertiary },
  zoneOff: { opacity: 0.5 },
  hint: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    color: theme.colors.text.primary,
  },
  sub: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: theme.colors.text.secondary,
  },
  pebble: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 32,
    height: 18,
    resizeMode: 'contain',
    opacity: 0.85,
  },
});

export default React.memo(SwipeZone);
