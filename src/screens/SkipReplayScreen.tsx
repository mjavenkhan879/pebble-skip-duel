import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import IconButton from '../components/IconButton';
import LakeViewport from '../components/LakeViewport';
import PrimaryButton from '../components/PrimaryButton';
import ReplayControls from '../components/ReplayControls';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SkipCounter from '../components/SkipCounter';
import WindIndicator from '../components/WindIndicator';
import { BOTTOM_INSET, H_PADDING } from '../constants/config';
import { getLake } from '../constants/lakes';
import theme from '../constants/theme';
import { ThrowRecording } from '../game/types';
import useReplay from '../hooks/useReplay';

type Props = {
  recording: ThrowRecording | null;
  onBack: () => void;
  onPlay: () => void;
};

/**
 * Playback of a stored throw. It never scores, unlocks, regenerates an
 * environment or advances a duel.
 */
export default function SkipReplayScreen({ recording, onBack, onPlay }: Props) {
  const replay = useReplay(recording);

  if (!recording) {
    return (
      <AppBackground variant="replay">
        <ScreenHeader
          title="Skip Replay"
          leftSlot={
            <IconButton Icon={ArrowLeft} accessibilityLabel="Go back" onPress={onBack} />
          }
        />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Throw a pebble to make a replay</Text>
        </View>
        <View style={styles.actions}>
          <PrimaryButton label="PLAY" Icon={Play} onPress={onPlay} />
        </View>
      </AppBackground>
    );
  }

  const lake = getLake(recording.lakeId);

  return (
    <AppBackground variant="replay" tint={lake.tint} tintEnd={lake.tintEnd}>
      <ScreenHeader
        title="Skip Replay"
        subtitle={lake.name}
        leftSlot={<IconButton Icon={ArrowLeft} accessibilityLabel="Go back" onPress={onBack} />}
      />

      <View style={styles.area}>
        <LakeViewport
          lake={lake}
          environment={recording.environment}
          phase={replay.finished ? 'sinking' : 'flying'}
          pose={replay.pose}
          contacts={recording.contacts}
          simTime={replay.elapsed}
          angle={recording.input.angle}
          pebbleId={recording.pebbleId}
          badge="REPLAY">
          <View style={styles.windBar} pointerEvents="none">
            <WindIndicator wind={recording.environment.wind} />
          </View>
          <View style={styles.counter} pointerEvents="none">
            <SkipCounter count={replay.skips} best={0} />
          </View>
        </LakeViewport>
      </View>

      <LinearGradient
        colors={theme.gradients.controls}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.panel}>
        <ReplayControls
          elapsedMs={replay.elapsed}
          durationMs={replay.duration}
          speed={replay.speed}
          playing={replay.playing}
          onSeek={replay.seek}
          onSpeedChange={replay.setSpeed}
          onToggle={replay.toggle}
        />
        <PrimaryButton label="REPLAY AGAIN" Icon={RotateCcw} onPress={replay.restart} />
        <SecondaryButton label="BACK TO RESULT" Icon={ArrowLeft} onPress={onBack} />
      </LinearGradient>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, paddingHorizontal: H_PADDING, paddingTop: 12, paddingBottom: 12 },
  windBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.surfaceSoft,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  counter: { position: 'absolute', left: 0, right: 0, top: 60, alignItems: 'center' },
  panel: {
    width: '100%',
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: BOTTOM_INSET,
    gap: 10,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    ...theme.shadow.sheet,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  actions: { paddingHorizontal: H_PADDING, paddingBottom: BOTTOM_INSET, gap: 10 },
});
