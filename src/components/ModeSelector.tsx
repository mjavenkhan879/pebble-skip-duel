import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { Mode } from '../game/types';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  value: Mode;
  onChange: (mode: Mode) => void;
};

const OPTIONS: { id: Mode; label: string }[] = [
  { id: 'solo', label: 'Solo' },
  { id: 'duel', label: 'Two players' },
];

/** Two 48dp segments. Selection shows as fill AND a ring, never colour alone. */
function ModeSelector({ value, onChange }: Props) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {OPTIONS.map(opt => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            hitSlop={HIT}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label + ' mode'}
            style={[styles.segment, active ? styles.active : styles.idle]}>
            <Text style={[styles.label, active ? styles.labelActive : null]} numberOfLines={1}>
              {opt.label}
            </Text>
            {active ? <View style={styles.underline} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    height: 48,
  },
  segment: {
    flex: 1,
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idle: {
    backgroundColor: theme.colors.ui.surfaceCool,
    borderColor: theme.colors.ui.border,
  },
  active: {
    backgroundColor: theme.colors.bg.tertiary,
    borderColor: theme.colors.lake.green,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    color: theme.colors.text.muted,
  },
  labelActive: { color: theme.colors.text.primary },
  underline: {
    width: 28,
    height: 3,
    borderRadius: 2,
    marginTop: 3,
    backgroundColor: theme.colors.lake.green,
  },
});

export default React.memo(ModeSelector);
