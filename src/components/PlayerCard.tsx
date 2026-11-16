import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  playerId: 1 | 2;
  total: number;
  best: number;
  active?: boolean;
  caption?: string;
};

/** Numbered marker plus accent colour — never colour alone. */
function PlayerCard({ playerId, total, best, active = false, caption }: Props) {
  const tone = playerId === 1 ? theme.colors.player.one : theme.colors.player.two;
  return (
    <View
      style={[styles.card, { borderColor: active ? tone : theme.colors.ui.border }]}
      accessible
      accessibilityLabel={'Player ' + String(playerId) + ', total ' + String(total) + ' skips'}>
      <View style={[styles.marker, { backgroundColor: tone }]}>
        <Text style={styles.markerText}>{String(playerId)}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {'Player ' + String(playerId)}
      </Text>
      <Text style={[styles.total, { color: tone }]} numberOfLines={1}>
        {String(total)}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        TOTAL SKIPS
      </Text>
      <Text style={styles.best} numberOfLines={1}>
        {caption || 'Best throw ' + String(best)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    backgroundColor: theme.colors.ui.surface,
    ...theme.shadow.card,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: { fontSize: 16, fontWeight: '800', lineHeight: 20, color: theme.colors.text.onAccent },
  name: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 6,
    color: theme.colors.text.primary,
  },
  total: { fontSize: 32, fontWeight: '800', lineHeight: 38 },
  label: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
  },
  best: { fontSize: 12, fontWeight: '500', lineHeight: 16, marginTop: 4, color: theme.colors.text.secondary },
});

export default React.memo(PlayerCard);
