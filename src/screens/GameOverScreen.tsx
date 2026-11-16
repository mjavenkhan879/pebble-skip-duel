import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Home, Play, RotateCcw, Users } from 'lucide-react-native';
import assets from '../assets';
import AppBackground from '../components/AppBackground';
import IconButton from '../components/IconButton';
import PlayerCard from '../components/PlayerCard';
import PrimaryButton from '../components/PrimaryButton';
import ResultCard from '../components/ResultCard';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import DuelTurnStrip from '../components/DuelTurnStrip';
import UnlockCard from '../components/UnlockCard';
import { BOTTOM_INSET, H_PADDING } from '../constants/config';
import { getLake } from '../constants/lakes';
import theme from '../constants/theme';
import { hintFor } from '../game/progression';
import { DuelState, bestFor, isFinished, outcome, totalFor } from '../game/duelRules';
import { ThrowResult } from '../game/types';

type Props = {
  result: ThrowResult;
  previousBest: number | null;
  newRecord: boolean;
  matched: boolean;
  unlockedPebbleId: string | null;
  duel: DuelState | null;
  onThrowAgain: () => void;
  onNextTurn: () => void;
  onReplay: () => void;
  onMenu: () => void;
};

/** Throw Result / Duel Result. Always a separate screen after every throw. */
export default function GameOverScreen(props: Props) {
  const {
    result,
    previousBest,
    newRecord,
    matched,
    unlockedPebbleId,
    duel,
    onThrowAgain,
    onNextTurn,
    onReplay,
    onMenu,
  } = props;

  const lake = getLake(result.lakeId);
  const duelFinished = duel !== null && isFinished(duel);
  const title = duel ? (duelFinished ? 'Duel Result' : 'Turn Result') : 'Throw Result';

  return (
    <AppBackground variant="result" tint={lake.tint} tintEnd={lake.tintEnd}>
      <ScreenHeader
        title={title}
        leftSlot={
          <IconButton
            source={assets.iconHome}
            accessibilityLabel="Back to Lakeside"
            onPress={onMenu}
          />
        }
      />

      <View style={styles.body}>
        <Image source={assets.spriteSplash} style={styles.medallion} />

        {duelFinished && duel ? (
          <View style={styles.duelBlock}>
            <View style={styles.playerRow}>
              <View style={styles.playerSlot}>
                <PlayerCard
                  playerId={1}
                  total={totalFor(duel, 1)}
                  best={bestFor(duel, 1)}
                  active={outcome(duel).winner === 1}
                />
              </View>
              <View style={styles.playerSlot}>
                <PlayerCard
                  playerId={2}
                  total={totalFor(duel, 2)}
                  best={bestFor(duel, 2)}
                  active={outcome(duel).winner === 2}
                />
              </View>
            </View>
            <Text style={styles.outcome} numberOfLines={1}>
              {outcome(duel).text}
            </Text>
            <DuelTurnStrip turns={duel.turns} activeIndex={-1} />
          </View>
        ) : (
          <ResultCard
            skips={result.skips}
            lakeName={lake.name}
            previousBest={previousBest}
            newRecord={newRecord}
            matched={matched}
            hint={hintFor(result)}
          />
        )}

        {unlockedPebbleId ? (
          <UnlockCard pebbleId={unlockedPebbleId} lakeName={lake.name} />
        ) : null}
      </View>

      <View style={styles.actions}>
        {duel && !duelFinished ? (
          <PrimaryButton label="NEXT TURN" Icon={Users} onPress={onNextTurn} />
        ) : null}
        {duel && duelFinished ? (
          <PrimaryButton label="PLAY AGAIN" Icon={Play} onPress={onThrowAgain} />
        ) : null}
        {!duel ? (
          <PrimaryButton label="THROW AGAIN" Icon={RotateCcw} onPress={onThrowAgain} />
        ) : null}

        <Text style={styles.replayCaption} numberOfLines={1}>
          Slow-motion replay of the last throw
        </Text>
        <SecondaryButton label="WATCH AGAIN" Icon={Play} onPress={onReplay} />
        <SecondaryButton label="LAKESIDE" Icon={Home} onPress={onMenu} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: H_PADDING,
    paddingTop: 16,
    gap: 12,
    justifyContent: 'center',
  },
  medallion: {
    position: 'absolute',
    alignSelf: 'center',
    top: 24,
    width: 240,
    height: 240,
    resizeMode: 'contain',
    opacity: 0.18,
  },
  duelBlock: { width: '100%', gap: 10 },
  playerRow: { flexDirection: 'row', gap: 10, width: '100%' },
  playerSlot: { flex: 1 },
  outcome: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  actions: {
    paddingHorizontal: H_PADDING,
    paddingTop: 12,
    paddingBottom: BOTTOM_INSET,
    gap: 10,
  },
  replayCaption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
});
