import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Gem, Play, Settings, Trophy } from 'lucide-react-native';
import assets from '../assets';
import AppBackground from '../components/AppBackground';
import IconButton from '../components/IconButton';
import LakeSelector from '../components/LakeSelector';
import ModeSelector from '../components/ModeSelector';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import { ANIM, BOTTOM_INSET, COMPACT, H_PADDING } from '../constants/config';
import { getLake } from '../constants/lakes';
import theme from '../constants/theme';
import { Progress, paintingsEarned, totalPaintings } from '../game/progression';
import { Mode } from '../game/types';

type Props = {
  progress: Progress;
  lakeId: number;
  mode: Mode;
  onLakeChange: (id: number) => void;
  onModeChange: (mode: Mode) => void;
  onPlay: () => void;
  onPouch: () => void;
  onRecords: () => void;
  onSettings: () => void;
};

/** M2 Bottom-Sheet: scenic upper half, raised sheet with the actions below. */
export default function MenuScreen(props: Props) {
  const {
    progress,
    lakeId,
    mode,
    onLakeChange,
    onModeChange,
    onPlay,
    onPouch,
    onRecords,
    onSettings,
  } = props;

  const rise = useRef(new Animated.Value(12)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const lake = getLake(lakeId);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rise, { toValue: 0, duration: ANIM.fade, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: ANIM.fade, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  return (
    <AppBackground variant="menu" tint={lake.tint} tintEnd={lake.tintEnd}>
      <ScreenHeader
        compact
        title="Lakeside"
        rightSlot={
          <IconButton
            Icon={Settings}
            accessibilityLabel="Open settings"
            onPress={onSettings}
            tone="ghost"
          />
        }
      />

      <View style={styles.panorama}>
        <Image source={assets.spriteStones} style={styles.stones} />
        <Image source={assets.spriteReeds} style={styles.reeds} />
        <Image source={assets.spriteLeaf} style={styles.leaf} />

        <View style={styles.lakeLabel}>
          <Text style={styles.lakeName} numberOfLines={1}>
            {lake.name}
          </Text>
          <Text style={styles.lakeCondition} numberOfLines={1}>
            {lake.condition}
          </Text>
        </View>

        <LakeSelector
          selectedId={lakeId}
          records={progress.records}
          paintings={paintingsEarned(progress)}
          totalPaintings={totalPaintings()}
          onSelect={onLakeChange}
        />
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheetWrap, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <LinearGradient
          colors={theme.gradients.sheet}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.sheet}>
          <View style={styles.titleRow}>
            <Image source={assets.logo} style={styles.sheetLogo} />
            <Text style={styles.sheetTitle} numberOfLines={1}>
              Pebble Skip Duel
            </Text>
          </View>

          <ModeSelector value={mode} onChange={onModeChange} />

          <Text style={styles.hint} numberOfLines={1}>
            Flick low. Count the ripples.
          </Text>

          <PrimaryButton
            label="PLAY"
            Icon={Play}
            onPress={onPlay}
            accessibilityLabel={mode === 'solo' ? 'Play solo throw' : 'Play two player duel'}
          />

          <View style={styles.utilityRow}>
            <SecondaryButton label="POUCH" Icon={Gem} onPress={onPouch} flex />
            <SecondaryButton label="RECORDS" Icon={Trophy} onPress={onRecords} flex />
            <SecondaryButton label="SETTINGS" Icon={Settings} onPress={onSettings} flex />
          </View>
        </LinearGradient>
      </Animated.View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  panorama: {
    flex: 1,
    paddingHorizontal: H_PADDING,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'flex-end',
  },
  stones: {
    position: 'absolute',
    left: 10,
    bottom: 112,
    width: 96,
    height: 96,
    resizeMode: 'contain',
    opacity: 0.9,
  },
  reeds: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    width: 84,
    height: 84,
    resizeMode: 'contain',
    opacity: 0.9,
  },
  leaf: {
    position: 'absolute',
    right: 92,
    top: 18,
    width: 40,
    height: 40,
    resizeMode: 'contain',
    opacity: 0.75,
  },
  lakeLabel: {
    alignSelf: 'flex-start',
    maxWidth: '82%',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.ui.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  lakeName: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: theme.colors.text.primary,
  },
  lakeCondition: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
    color: theme.colors.text.secondary,
  },
  sheetWrap: { width: '100%' },
  sheet: {
    width: '100%',
    paddingHorizontal: H_PADDING,
    paddingTop: 16,
    paddingBottom: BOTTOM_INSET,
    gap: COMPACT ? 10 : 14,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    ...theme.shadow.sheet,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sheetLogo: { width: 44, height: 44, resizeMode: 'contain' },
  sheetTitle: {
    flex: 1,
    fontSize: COMPACT ? 24 : 28,
    fontWeight: '700',
    lineHeight: COMPACT ? 30 : 34,
    color: theme.colors.text.primary,
  },
  hint: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 8,
    color: theme.colors.text.muted,
  },
  utilityRow: { flexDirection: 'row', gap: 8, width: '100%', height: 48 },
});
