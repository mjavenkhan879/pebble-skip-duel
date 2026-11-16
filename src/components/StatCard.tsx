import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  value: string;
  label: string;
  tone: string;
  accessibilityLabel?: string;
};

/**
 * One component for every numeric card in the app (menu, results, records).
 * Semantics come from the accent dot colour and the number, not from a raster
 * icon — so a row of these is pixel-identical apart from the colour.
 */
function StatCard({ value, label, tone, accessibilityLabel }: Props) {
  return (
    <View
      style={[styles.card, { borderColor: tone + '55' }]}
      accessible
      accessibilityLabel={accessibilityLabel || label + ' ' + value}>
      <View style={[styles.dot, { backgroundColor: tone }]} />
      <Text style={[styles.value, { color: tone }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    backgroundColor: theme.colors.ui.surface,
    ...theme.shadow.card,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  value: { fontSize: 22, fontWeight: '800', lineHeight: 26 },
  label: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
    letterSpacing: 1,
    marginTop: 4,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
  },
});

export default React.memo(StatCard);
