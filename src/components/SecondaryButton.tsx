import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SECONDARY_H } from '../constants/config';
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
  tone?: 'default' | 'outline';
  flex?: boolean;
};

/** 48dp bordered action. Same 24dp icon canvas as PrimaryButton. */
function SecondaryButton({
  label,
  onPress,
  disabled = false,
  accessibilityLabel,
  Icon,
  tone = 'default',
  flex = false,
}: Props) {
  const press = usePressScale(0.97);
  const color = tone === 'outline' ? theme.colors.lake.deep : theme.colors.text.primary;
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
      style={[styles.target, flex ? styles.flexTarget : null]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shell,
          tone === 'outline' ? styles.outline : styles.solid,
          disabled ? styles.disabled : null,
          press.style,
        ]}>
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={24} color={color} strokeWidth={2} />
            </View>
          ) : null}
          <Text style={[styles.label, { color }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: { width: '100%', height: SECONDARY_H },
  flexTarget: { flex: 1, width: undefined },
  shell: {
    width: '100%',
    height: SECONDARY_H,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  solid: {
    backgroundColor: theme.colors.ui.surfaceSoft,
    borderColor: theme.colors.ui.borderCool,
  },
  outline: {
    backgroundColor: theme.colors.ui.surfaceCool,
    borderColor: theme.colors.lake.deep,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  iconBox: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 15, fontWeight: '700', lineHeight: 24, letterSpacing: 0.4 },
  disabled: { opacity: 0.48 },
});

export default React.memo(SecondaryButton);
