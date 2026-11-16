import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Info, SlidersHorizontal } from 'lucide-react-native';
import assets from '../assets';
import AppBackground from '../components/AppBackground';
import AngleSlider from '../components/AngleSlider';
import HelpModal from '../components/HelpModal';
import IconButton from '../components/IconButton';
import LakeViewport from '../components/LakeViewport';
import PauseModal from '../components/PauseModal';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SkipCounter from '../components/SkipCounter';
import SwipeZone from '../components/SwipeZone';
import ThrowControlsModal from '../components/ThrowControlsModal';
import WindIndicator from '../components/WindIndicator';
import { ANGLE_DEFAULT, BOTTOM_INSET, CONTROLS_GAP, H_PADDING } from '../constants/config';
import { getLake } from '../constants/lakes';
import theme from '../constants/theme';
import { makeInput } from '../game/throwInput';
import { ThrowResult } from '../game/types';
import useThrowSession from '../hooks/useThrowSession';

type Props = {
  lakeId: number;
  sessionSeed: number;
  roundCounter: number;
  pebbleId: string;
  best: number;
  duel: boolean;
  turnLabel: string;
  haptics: boolean;
  onSkipFeedback: () => void;
  onGameOver: (result: ThrowResult) => void;
  onHome: () => void;
};

/** G1 Classic Stack: header, expanding lake viewport, separate control panel. */
export default function GameScreen(props: Props) {
  const {
    lakeId,
    sessionSeed,
    roundCounter,
    pebbleId,
    best,
    duel,
    turnLabel,
    onSkipFeedback,
    onGameOver,
    onHome,
  } = props;

  const lake = getLake(lakeId);
  const [helpVisible, setHelpVisible] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [pauseVisible, setPauseVisible] = useState(false);
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const session = useThrowSession({
    lakeId,
    sessionSeed,
    roundCounter,
    pebbleId,
    initialAngle: ANGLE_DEFAULT,
    onSkip: onSkipFeedback,
    onComplete: onGameOver,
  });

  useEffect(() => {
    return () => {
      if (noticeTimer.current !== null) {
        clearTimeout(noticeTimer.current);
      }
    };
  }, []);

  const flash = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current !== null) {
      clearTimeout(noticeTimer.current);
    }
    noticeTimer.current = setTimeout(() => setNotice(''), 1600);
  }, []);

  const commit = useCallback(
    (heading: number, power: number) => {
      setNotice('');
      session.commit(makeInput(session.angle, heading, power));
    },
    [session],
  );

  const throwFromControls = useCallback(
    (heading: number, power: number) => {
      setControlsVisible(false);
      commit(heading, power);
    },
    [commit],
  );

  const openPause = useCallback(() => {
    session.setPaused(true);
    setPauseVisible(true);
  }, [session]);

  const resume = useCallback(() => {
    setPauseVisible(false);
    session.setPaused(false);
  }, [session]);

  const aiming = session.phase === 'aiming';
  const hint = aiming ? 'Flick upward to throw' : 'Watch your skips';

  return (
    <AppBackground variant="game" tint={lake.tint} tintEnd={lake.tintEnd}>
      <ScreenHeader
        title={lake.name}
        subtitle={duel ? turnLabel : 'Solo'}
        leftSlot={
          <IconButton
            source={assets.iconHome}
            accessibilityLabel="Back to Lakeside"
            onPress={onHome}
          />
        }
        rightSlot={
          <IconButton
            source={assets.iconPause}
            accessibilityLabel="Pause the throw"
            onPress={openPause}
          />
        }
      />

      <View style={styles.area}>
        <LakeViewport
          lake={lake}
          environment={session.environment}
          phase={session.phase}
          pose={session.pose}
          contacts={session.contacts}
          simTime={session.simTime}
          angle={session.angle}
          pebbleId={pebbleId}>
          <View style={styles.windBar} pointerEvents="none">
            <WindIndicator wind={session.environment.wind} />
          </View>
          <View style={styles.counter} pointerEvents="none">
            <SkipCounter count={session.skips} best={best} />
          </View>
          {notice ? (
            <View style={styles.notice} pointerEvents="none">
              <Text style={styles.noticeText} numberOfLines={1}>
                {notice}
              </Text>
            </View>
          ) : null}
        </LakeViewport>
      </View>

      <LinearGradient
        colors={theme.gradients.controls}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.controls}>
        <AngleSlider value={session.angle} disabled={!aiming} onChange={session.setAngle} />
        <SwipeZone disabled={!aiming} hint={hint} onCommit={commit} onInvalid={flash} />
        <View style={styles.secondaryRow}>
          <SecondaryButton
            label="THROW CONTROLS"
            Icon={SlidersHorizontal}
            onPress={() => setControlsVisible(true)}
            disabled={!aiming}
            flex
          />
          <SecondaryButton
            label="HOW TO"
            Icon={Info}
            onPress={() => setHelpVisible(true)}
            flex
          />
        </View>
      </LinearGradient>

      <HelpModal visible={helpVisible} onDismiss={() => setHelpVisible(false)} />
      <ThrowControlsModal
        visible={controlsVisible}
        angle={session.angle}
        onThrow={throwFromControls}
        onCancel={() => setControlsVisible(false)}
      />
      <PauseModal visible={pauseVisible} duel={duel} onResume={resume} onLeave={onHome} />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    paddingHorizontal: H_PADDING,
    paddingTop: 12,
    paddingBottom: 12,
  },
  windBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.surfaceSoft,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  counter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    alignItems: 'center',
  },
  notice: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.ui.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.lake.purple,
  },
  noticeText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    color: theme.colors.text.primary,
  },
  controls: {
    width: '100%',
    paddingHorizontal: H_PADDING,
    paddingTop: 12,
    paddingBottom: BOTTOM_INSET,
    gap: CONTROLS_GAP,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    ...theme.shadow.sheet,
  },
  secondaryRow: { flexDirection: 'row', gap: 8, width: '100%', height: 48 },
});
