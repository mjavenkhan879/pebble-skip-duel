import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Home, Play, Users } from 'lucide-react-native';
import assets from '../assets';
import { Image } from 'react-native';
import AppBackground from '../components/AppBackground';
import DuelTurnStrip from '../components/DuelTurnStrip';
import IconButton from '../components/IconButton';
import PlayerCard from '../components/PlayerCard';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SoftCard from '../components/SoftCard';
import { BOTTOM_INSET, DUEL_ROUNDS, H_PADDING } from '../constants/config';
import { getLake } from '../constants/lakes';
import theme from '../constants/theme';
import { DuelState, activePlayer, activeRound, bestFor, totalFor } from '../game/duelRules';

type Props = {
  duel: DuelState;
  setup: boolean;
  onStart: () => void;
  onReady: () => void;
  onLeave: () => void;
};

/** Setup and handoff. A handoff never consumes a turn or throws by itself. */
export default function PassAndPlayScreen({ duel, setup, onStart, onReady, onLeave }: Props) {
  const lake = getLake(duel.lakeId);
  const player = activePlayer(duel);
  const round = activeRound(duel);

  return (
    <AppBackground variant="duel" tint={lake.tint} tintEnd={lake.tintEnd}>
      <ScreenHeader
        title="Pass and Play"
        subtitle={lake.name}
        leftSlot={<IconButton Icon={ArrowLeft} accessibilityLabel="Go back" onPress={onLeave} />}
      />

      <View style={styles.body}>
        <Image source={assets.spriteReeds} style={styles.decorLeft} />
        <Image source={assets.spriteStones} style={styles.decorRight} />

        {setup ? (
          <>
            <View style={styles.playerRow}>
              <View style={styles.playerSlot}>
                <PlayerCard playerId={1} total={0} best={0} active caption="Throws first" />
              </View>
              <View style={styles.playerSlot}>
                <PlayerCard playerId={2} total={0} best={0} caption="Throws second" />
              </View>
            </View>
            <SoftCard tone="cool" padding={14}>
              <Text style={styles.ruleTitle}>{lake.name}</Text>
              <Text style={styles.rule}>
                {String(DUEL_ROUNDS) + ' rounds · 1 throw each per round'}
              </Text>
              <Text style={styles.rule}>
                Both players get the same wind and leaves each round.
              </Text>
            </SoftCard>
          </>
        ) : (
          <>
            <View style={styles.handoff}>
              <Image source={assets.spritePebble} style={styles.pebble} />
              <Text style={styles.handoffTitle} numberOfLines={1}>
                {'Pass to Player ' + String(player)}
              </Text>
              <Text style={styles.handoffRound} numberOfLines={1}>
                {'Round ' + String(round) + ' of ' + String(DUEL_ROUNDS)}
              </Text>
              <Text style={styles.handoffHint} numberOfLines={2}>
                Set your angle when you are ready.
              </Text>
            </View>
            <View style={styles.playerRow}>
              <View style={styles.playerSlot}>
                <PlayerCard
                  playerId={1}
                  total={totalFor(duel, 1)}
                  best={bestFor(duel, 1)}
                  active={player === 1}
                />
              </View>
              <View style={styles.playerSlot}>
                <PlayerCard
                  playerId={2}
                  total={totalFor(duel, 2)}
                  best={bestFor(duel, 2)}
                  active={player === 2}
                />
              </View>
            </View>
            <DuelTurnStrip turns={duel.turns} activeIndex={duel.activeIndex} />
          </>
        )}
      </View>

      <View style={styles.actions}>
        {setup ? (
          <PrimaryButton label="START DUEL" Icon={Users} onPress={onStart} />
        ) : (
          <PrimaryButton label="READY TO THROW" Icon={Play} onPress={onReady} />
        )}
        <SecondaryButton label="LAKESIDE" Icon={Home} onPress={onLeave} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: H_PADDING,
    paddingTop: 16,
    gap: 14,
    justifyContent: 'center',
  },
  decorLeft: {
    position: 'absolute',
    left: 8,
    top: 12,
    width: 72,
    height: 72,
    resizeMode: 'contain',
    opacity: 0.45,
  },
  decorRight: {
    position: 'absolute',
    right: 8,
    bottom: 12,
    width: 84,
    height: 84,
    resizeMode: 'contain',
    opacity: 0.45,
  },
  playerRow: { flexDirection: 'row', gap: 10, width: '100%' },
  playerSlot: { flex: 1 },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    color: theme.colors.text.primary,
  },
  rule: { fontSize: 13, fontWeight: '500', lineHeight: 18, color: theme.colors.text.muted },
  handoff: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.surface,
    ...theme.shadow.card,
  },
  pebble: { width: 96, height: 60, resizeMode: 'contain' },
  handoffTitle: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    marginTop: 8,
    color: theme.colors.text.primary,
  },
  handoffRound: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  handoffHint: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
    marginTop: 4,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  actions: {
    paddingHorizontal: H_PADDING,
    paddingTop: 12,
    paddingBottom: BOTTOM_INSET,
    gap: 10,
  },
});
