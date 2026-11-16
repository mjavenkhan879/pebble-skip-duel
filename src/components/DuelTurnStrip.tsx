import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DuelTurn } from '../game/types';
import theme from '../constants/theme';

type Props = {
  turns: DuelTurn[];
  activeIndex: number;
};

/** Six labelled turn positions. Shape and number carry the meaning. */
function DuelTurnStrip({ turns, activeIndex }: Props) {
  return (
    <View style={styles.row} accessible accessibilityLabel="Duel turn order">
      {turns.map(turn => {
        const tone = turn.player === 1 ? theme.colors.player.one : theme.colors.player.two;
        const done = turn.score !== null;
        const active = turn.index === activeIndex;
        return (
          <View
            key={'turn' + String(turn.index)}
            style={[
              styles.cell,
              { borderColor: active ? tone : theme.colors.ui.border },
              active ? styles.active : null,
            ]}>
            <Text style={[styles.player, { color: tone }]} numberOfLines={1}>
              {'P' + String(turn.player)}
            </Text>
            <Text style={styles.score} numberOfLines={1}>
              {done ? String(turn.score) : '·'}
            </Text>
            <Text style={styles.round} numberOfLines={1}>
              {'R' + String(turn.round)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, width: '100%' },
  cell: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    backgroundColor: theme.colors.ui.surface,
  },
  active: { backgroundColor: theme.colors.bg.tertiary },
  player: { fontSize: 11, fontWeight: '800', lineHeight: 14 },
  score: { fontSize: 16, fontWeight: '800', lineHeight: 20, color: theme.colors.text.primary },
  round: { fontSize: 9, fontWeight: '600', lineHeight: 12, color: theme.colors.text.muted },
});

export default React.memo(DuelTurnStrip);
