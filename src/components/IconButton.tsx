import React from 'react';
import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import theme from '../constants/theme';
import { IconType } from './icon';
import usePressScale from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
  /** lucide component, rendered at a fixed 24dp canvas. */
  Icon?: IconType;
  /** Or one of the fixed PNG glyphs. */
  source?: ImageSourcePropType;
  color?: string;
  tone?: 'solid' | 'ghost';
  disabled?: boolean;
};

/** 48 x 48 navigation target with explicit width AND height. */
function IconButton({
  onPress,
  accessibilityLabel,
  Icon,
  source,
  color = theme.colors.text.secondary,
  tone = 'solid',
  disabled = false,
}: Props) {
  const press = usePressScale(0.94);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={styles.target}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.inner,
          tone === 'solid' ? styles.solid : styles.ghost,
          disabled ? styles.disabled : null,
          press.style,
        ]}>
        {Icon ? <Icon size={24} color={color} strokeWidth={2} /> : null}
        {!Icon && source ? <Image source={source} style={styles.image} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: theme.colors.ui.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: { opacity: 0.48 },
  image: { width: 24, height: 24, resizeMode: 'contain' },
});

const Memo = React.memo(IconButton);
export default Memo;
