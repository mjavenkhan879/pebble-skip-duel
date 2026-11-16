import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';
import assets from '../assets';
import AppBackground from '../components/AppBackground';
import { LOADER_DURATION_MS, WINDOW_W } from '../constants/config';
import theme from '../constants/theme';

const BAR_W = 200;

type Props = { onDone: () => void };

/**
 * Splash. Deliberately dark: the loader must not look like Lakeside.
 * Fixed 8000ms, then a fade into the menu. Non-interactive brand card: no buttons, no mode chips.
 */
export default function LoaderScreen({ onDone }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(8)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(enter, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(lift, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (doneRef.current) {
        return;
      }
      doneRef.current = true;
      onDone();
    }, LOADER_DURATION_MS);

    return () => clearTimeout(timer);
  }, [enter, lift, onDone, progress]);

  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });
  const barShift = progress.interpolate({ inputRange: [0, 1], outputRange: [-BAR_W / 2, 0] });

  return (
    <AppBackground variant="loader">
      <View style={styles.ripples} pointerEvents="none">
        <Svg width={WINDOW_W} height={WINDOW_W} viewBox="0 0 100 100">
          <Ellipse cx="50" cy="50" rx="46" ry="16" stroke={theme.colors.bg.tertiary} strokeWidth={0.8} opacity={0.12} fill="none" />
          <Ellipse cx="50" cy="50" rx="34" ry="12" stroke={theme.colors.bg.tertiary} strokeWidth={0.8} opacity={0.12} fill="none" />
          <Ellipse cx="50" cy="50" rx="22" ry="8" stroke={theme.colors.bg.tertiary} strokeWidth={0.8} opacity={0.12} fill="none" />
        </Svg>
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.center, { opacity: enter, transform: [{ scale }] }]}>
        <Animated.View style={[styles.brandCard, { transform: [{ translateY: lift }] }]}>
          <Image source={assets.logo} style={styles.logo} />
        </Animated.View>

        <Text style={styles.title} numberOfLines={2}>
          Pebble Skip Duel
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          Small stone. Long story.
        </Text>

        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              { transform: [{ translateX: barShift }, { scaleX: progress }] },
            ]}
          />
        </View>
        <Text style={styles.loading} numberOfLines={1}>
          LOADING
        </Text>
      </Animated.View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  ripples: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  brandCard: {
    width: 148,
    height: 148,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239,246,237,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(176,221,189,0.45)',
  },
  logo: { width: 112, height: 112, resizeMode: 'contain' },
  title: {
    marginTop: 28,
    maxWidth: 300,
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -0.5,
    textAlign: 'center',
    color: theme.colors.text.onDark,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
    color: theme.colors.bg.tertiary,
  },
  barTrack: {
    marginTop: 36,
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: theme.colors.lake.deep,
  },
  barFill: {
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.lake.green,
  },
  loading: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 3,
    color: theme.colors.text.onDark,
  },
});
