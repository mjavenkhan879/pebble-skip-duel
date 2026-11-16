import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PRIMARY_H } from '../constants/config';
import theme from '../constants/theme';
import { IconType } from './icon';
import usePressScale from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  Icon?: IconType;
  colors?: [string, string];
};

/**
 * 56dp gradient CTA. Pressable is the PARENT, the animated visual sits inside,
 * so the release tap survives Android release builds.
 */
function PrimaryButton({
  label,
  onPress,
  disabled = false,
  accessibilityLabel,
  Icon,
  colors = theme.gradients.primary,
}: Props) {
  const press = usePressScale(0.97);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled }}
      style={styles.target}>
      <Animated.View
        pointerEvents="none"
        style={[styles.shell, disabled ? styles.disabled : null, press.style]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}>
          <View style={styles.row}>
            {Icon ? (
              <View style={styles.iconBox}>
                <Icon size={24} color={theme.colors.text.onAccent} strokeWidth={2} />
              </View>
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    width: '100%',
    height: PRIMARY_H,
  },
  shell: {
    width: '100%',
    height: PRIMARY_H,
    borderRadius: theme.radius.lg,
    ...theme.shadow.primary,
  },
  fill: {
    width: '100%',
    height: PRIMARY_H,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.6,
    color: theme.colors.text.onAccent,
  },
  disabled: { opacity: 0.48 },
});

export default React.memo(PrimaryButton);
