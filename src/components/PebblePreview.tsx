import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import assets from '../assets';
import { Pebble, PebbleMotif } from '../constants/pebbles';

type Props = {
  pebble: Pebble;
  width: number;
  height: number;
  dim?: boolean;
};

function Motif({ motif, color, accent }: { motif: PebbleMotif; color: string; accent: string }) {
  switch (motif) {
    case 'leaves':
      return (
        <>
          <Path d="M18 34 C26 22, 38 20, 44 24 C38 34, 26 38, 18 34 Z" fill={color} opacity={0.9} />
          <Path d="M46 36 C54 26, 66 24, 72 28 C66 38, 54 42, 46 36 Z" fill={color} opacity={0.7} />
          <Path d="M32 44 C40 36, 52 34, 58 38 C52 46, 40 50, 32 44 Z" fill={accent} opacity={0.8} />
        </>
      );
    case 'rings':
      return (
        <>
          <Ellipse cx="48" cy="34" rx="22" ry="9" stroke={color} strokeWidth={3} fill="none" />
          <Ellipse cx="48" cy="34" rx="13" ry="5.5" stroke={accent} strokeWidth={3} fill="none" />
          <Ellipse cx="48" cy="34" rx="5" ry="2.5" stroke={color} strokeWidth={2.5} fill="none" />
        </>
      );
    case 'dots':
      return (
        <>
          <Circle cx="26" cy="32" r="5" fill={color} />
          <Circle cx="42" cy="26" r="4.5" fill={color} />
          <Circle cx="58" cy="30" r="5.5" fill={color} />
          <Circle cx="70" cy="38" r="4" fill={accent} opacity={0.7} />
          <Circle cx="40" cy="42" r="4" fill={accent} opacity={0.7} />
        </>
      );
    case 'swash':
      return (
        <Path
          d="M14 44 C32 20, 62 18, 84 28 L80 38 C60 30, 34 32, 18 50 Z"
          fill={color}
          opacity={0.75}
        />
      );
    case 'ridge':
      return (
        <Path
          d="M16 44 L34 24 L46 36 L60 20 L80 44 Z"
          stroke={color}
          strokeWidth={3.5}
          fill="none"
          strokeLinejoin="round"
        />
      );
    case 'streak':
      return (
        <>
          <Path d="M14 42 C36 18, 64 18, 84 32 L80 42 C60 30, 36 32, 18 50 Z" fill={color} />
          <Path d="M24 50 C42 36, 62 36, 76 44" stroke={accent} strokeWidth={3} fill="none" />
        </>
      );
    case 'lines':
      return (
        <>
          <Path d="M16 26 C34 18, 56 18, 76 24" stroke={color} strokeWidth={3} fill="none" />
          <Path d="M14 36 C34 28, 58 28, 80 34" stroke={color} strokeWidth={3} fill="none" />
          <Path d="M18 46 C36 38, 58 38, 78 44" stroke={accent} strokeWidth={3} fill="none" />
        </>
      );
    case 'summit':
      return (
        <>
          <Path d="M22 46 L44 20 L64 46 Z" fill={color} opacity={0.85} />
          <Circle cx="72" cy="30" r="7" fill={accent} />
        </>
      );
    default:
      return <Rect x="0" y="0" width="0" height="0" fill="none" />;
  }
}

/**
 * Slate base (sprite_1) plus a vector painting overlay. No extra image names,
 * no circular mask, no oversized image hiding its own background.
 */
function PebblePreview({ pebble, width, height, dim = false }: Props) {
  return (
    <View style={[styles.root, { width, height }, dim ? styles.dim : null]}>
      <Image
        source={assets.spritePebble}
        style={{ width, height, resizeMode: 'contain' }}
        accessibilityIgnoresInvertColors
      />
      {pebble.motif !== 'none' ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={width} height={height} viewBox="0 0 96 64">
            <Motif motif={pebble.motif} color={pebble.color} accent={pebble.accent} />
          </Svg>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center' },
  dim: { opacity: 0.4 },
});

export default React.memo(PebblePreview);
