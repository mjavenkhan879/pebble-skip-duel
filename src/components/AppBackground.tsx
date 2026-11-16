import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

export type BackgroundVariant =
  | 'loader'
  | 'menu'
  | 'game'
  | 'result'
  | 'replay'
  | 'duel'
  | 'pouch'
  | 'records'
  | 'settings';

const OVERLAYS: Record<BackgroundVariant, string[]> = {
  loader: theme.gradients.loaderOverlay,
  menu: theme.gradients.menuOverlay,
  game: theme.gradients.gameOverlay,
  result: theme.gradients.resultOverlay,
  replay: theme.gradients.replayOverlay,
  duel: theme.gradients.duelOverlay,
  pouch: theme.gradients.pouchOverlay,
  records: theme.gradients.recordsOverlay,
  settings: theme.gradients.settingsOverlay,
};

type Props = {
  variant: BackgroundVariant;
  /** Per-lake wash drawn above the overlay. */
  tint?: string;
  tintEnd?: string;
  children?: React.ReactNode;
};

/** The one shared background. Screens differ by their gradient treatment. */
function AppBackground({ variant, tint, tintEnd, children }: Props) {
  const colors = OVERLAYS[variant];
  return (
    <ImageBackground source={assets.bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      {tint && tintEnd ? (
        <LinearGradient
          colors={[tint, tintEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  content: { flex: 1 },
});

export default React.memo(AppBackground);
