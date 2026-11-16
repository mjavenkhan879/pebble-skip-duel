import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import theme from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  description: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

/** Labelled 64dp row with an announced 48dp switch target. */
function SettingToggle({ label, description, value, onChange }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      hitSlop={HIT}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
      <View style={styles.switchBox} pointerEvents="none">
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: theme.colors.ui.border, true: theme.colors.lake.green }}
          thumbColor={theme.colors.bg.primary}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.surface,
    ...theme.shadow.card,
  },
  text: { flex: 1, paddingRight: 12 },
  label: { fontSize: 16, fontWeight: '700', lineHeight: 22, color: theme.colors.text.primary },
  description: { fontSize: 12, fontWeight: '500', lineHeight: 16, color: theme.colors.text.muted },
  switchBox: { width: 56, height: 48, alignItems: 'center', justifyContent: 'center' },
});

export default React.memo(SettingToggle);
