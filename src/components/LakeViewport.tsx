import React, { useCallback, useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Ellipse, Line, Path, Rect } from 'react-native-svg';
import assets from '../assets';
import { ANGLE_IDEAL, ANIM, VIEWPORT_BORDER, VIEWPORT_PAD } from '../constants/config';
import { Lake } from '../constants/lakes';
import theme from '../constants/theme';
import { Contact, RoundEnvironment, ThrowPhase } from '../game/types';
import { getPebble } from '../constants/pebbles';
import { liftPx, project } from '../utils/projection';
import { clamp } from '../utils/format';
import PebblePreview from './PebblePreview';

type Props = {
  lake: Lake;
  environment: RoundEnvironment;
  phase: ThrowPhase;
  pose: { x: number; z: number; height: number };
  contacts: Contact[];
  simTime: number;
  angle: number;
  pebbleId: string;
  reducedMotion?: boolean;
  badge?: string;
  children?: React.ReactNode;
};

const LEAF_MAX = 22;

function ridgePath(w: number, h: number): string {
  const p = (a: number, b: number) => String(w * a) + ' ' + String(h * b);
  return (
    'M0 ' + String(h * 0.16) +
    ' L' + p(0.22, 0.07) +
    ' L' + p(0.42, 0.14) +
    ' L' + p(0.66, 0.05) +
    ' L' + String(w) + ' ' + String(h * 0.16) +
    ' Z'
  );
}

/** Oblique lake scene. All drawing is clipped to the inner frame rectangle. */
function LakeViewport(props: Props) {
  const {
    lake,
    environment,
    phase,
    pose,
    contacts,
    simTime,
    angle,
    pebbleId,
    reducedMotion = false,
    badge,
    children,
  } = props;

  const [frame, setFrame] = useState({ w: 0, h: 0 });

  const onLayout = useCallback((ev: LayoutChangeEvent) => {
    const { width, height } = ev.nativeEvent.layout;
    setFrame({ w: Math.max(0, width), h: Math.max(0, height) });
  }, []);

  const ready = frame.w > 2 && frame.h > 2;
  const pebble = getPebble(pebbleId);

  const err = clamp(Math.abs(angle - ANGLE_IDEAL) / 21, 0, 1);
  const previewS = (6 + 9 * 0.7) * (1 - 0.45 * err);
  const previewZ = previewS * (0.22 + 0.018 * previewS);
  const preview = ready ? project(0, previewZ, frame) : { sx: 0, sy: 0, scale: 1 };

  const pebbleAt = ready ? project(pose.x, pose.z, frame) : { sx: 0, sy: 0, scale: 1 };
  const pebbleW = clamp(44 * pebbleAt.scale, 16, 44);
  const pebbleH = pebbleW * 0.62;
  const splashW = clamp(80 * pebbleAt.scale, 30, 80);
  const lakeTint = lake.tint;

  return (
    <View style={styles.frame}>
      <View style={styles.inner} onLayout={onLayout}>
        <LinearGradient
          colors={theme.gradients.water}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: lakeTint }]} pointerEvents="none" />
        {ready ? (
          <Svg width={frame.w} height={frame.h} style={StyleSheet.absoluteFill} pointerEvents="none">
            <Rect
              x={0}
              y={0}
              width={frame.w}
              height={frame.h * 0.16}
              fill={theme.colors.bg.tertiary}
              opacity={0.75}
            />
            <Path d={ridgePath(frame.w, frame.h)} fill={theme.colors.lake.deep} opacity={0.28} />
            <Line
              x1={0}
              y1={frame.h * 0.16}
              x2={frame.w}
              y2={frame.h * 0.16}
              stroke={theme.colors.lake.deep}
              strokeWidth={1.5}
              opacity={0.5}
            />
            {phase === 'aiming' ? (
              <Path
                d={
                  'M' + String(frame.w / 2) + ' ' + String(frame.h * 0.9) +
                  ' L' + String(frame.w / 2) + ' ' + String(preview.sy + 14)
                }
                stroke={theme.colors.lake.purple}
                strokeWidth={3}
                strokeDasharray="7 6"
                strokeLinecap="round"
              />
            ) : null}
            {phase === 'aiming' ? (
              <Ellipse
                cx={frame.w / 2}
                cy={preview.sy}
                rx={26 * preview.scale + 8}
                ry={9 * preview.scale + 3}
                stroke={theme.colors.lake.purple}
                strokeWidth={2.5}
                fill="none"
              />
            ) : null}
            {contacts.map(c => {
              const age = simTime - c.t;
              if (age < 0 || age > ANIM.ripple) {
                return null;
              }
              const p = project(c.x, c.z, frame);
              const u = reducedMotion ? 0.4 : age / ANIM.ripple;
              const fade = 1 - u;
              const base = 8 + u * 56;
              const tone =
                c.kind === 'leaf'
                  ? theme.colors.lake.green
                  : c.kind === 'skip'
                  ? theme.colors.lake.deep
                  : theme.colors.lake.purple;
              return (
                <React.Fragment key={'ring' + String(Math.round(c.t))}>
                  <Ellipse
                    cx={p.sx}
                    cy={p.sy}
                    rx={base * p.scale}
                    ry={base * 0.34 * p.scale}
                    stroke={tone}
                    strokeWidth={2.5}
                    opacity={fade * 0.9}
                    fill="none"
                  />
                  <Ellipse
                    cx={p.sx}
                    cy={p.sy}
                    rx={base * 0.55 * p.scale}
                    ry={base * 0.19 * p.scale}
                    stroke={tone}
                    strokeWidth={2}
                    opacity={fade * 0.6}
                    fill="none"
                  />
                </React.Fragment>
              );
            })}
          </Svg>
        ) : null}

        {ready
          ? environment.leaves.map(leaf => {
              const p = project(leaf.x, leaf.z, frame);
              const size = clamp(LEAF_MAX * p.scale, 10, LEAF_MAX);
              const gone = contacts.some(
                c => c.kind === 'leaf' && c.leafId === leaf.id && c.t <= simTime,
              );
              return (
                <Image
                  key={'leaf' + String(leaf.id)}
                  source={assets.spriteLeaf}
                  style={[
                    styles.leaf,
                    {
                      width: size,
                      height: size,
                      left: p.sx - size / 2,
                      top: p.sy - size / 2,
                      opacity: gone ? 0.35 : 0.95,
                      transform: [{ rotate: String(Math.round(leaf.rotation)) + 'deg' }],
                    },
                  ]}
                />
              );
            })
          : null}

        {ready && phase !== 'completed' ? (
          <View
            pointerEvents="none"
            style={[
              styles.pebbleWrap,
              {
                width: pebbleW,
                height: pebbleH,
                left: pebbleAt.sx - pebbleW / 2,
                top: pebbleAt.sy - pebbleH / 2 - liftPx(pose.height, pebbleAt.scale, frame),
              },
            ]}>
            <PebblePreview pebble={pebble} width={pebbleW} height={pebbleH} />
          </View>
        ) : null}

        {ready && phase === 'sinking' ? (
          <Image
            source={assets.spriteSplash}
            style={[
              styles.splash,
              {
                width: splashW,
                height: splashW,
                left: pebbleAt.sx - splashW / 2,
                top: pebbleAt.sy - splashW / 2,
              },
            ]}
          />
        ) : null}

        {ready
          ? contacts.map(c => {
              const age = simTime - c.t;
              if (c.kind !== 'skip' || age < 0 || age > 700) {
                return null;
              }
              const p = project(c.x, c.z, frame);
              return (
                <Text
                  key={'num' + String(Math.round(c.t))}
                  style={[styles.marker, { left: p.sx - 14, top: p.sy - 30, opacity: 1 - age / 700 }]}>
                  {String(c.skips)}
                </Text>
              );
            })
          : null}

        {badge ? (
          <View style={styles.badge} pointerEvents="none">
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}

        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
    padding: VIEWPORT_PAD,
    borderWidth: VIEWPORT_BORDER,
    borderColor: theme.colors.ui.border,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.ui.surfaceCool,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  inner: {
    flex: 1,
    width: '100%',
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.bg.secondary,
  },
  leaf: { position: 'absolute', resizeMode: 'contain' },
  pebbleWrap: { position: 'absolute' },
  splash: { position: 'absolute', resizeMode: 'contain', opacity: 0.9 },
  marker: {
    position: 'absolute',
    width: 28,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
    color: theme.colors.text.primary,
  },
  badge: {
    position: 'absolute',
    right: 10,
    top: 10,
    paddingHorizontal: 10,
    height: 26,
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.lake.purple,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    letterSpacing: 1.4,
    color: theme.colors.text.onAccent,
  },
});

export default React.memo(LakeViewport);
