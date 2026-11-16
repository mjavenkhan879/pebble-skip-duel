import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const WINDOW_W = SCREEN_W;
export const WINDOW_H = SCREEN_H;
export const COMPACT = SCREEN_H < 700;

/** Splash duration. EXACTLY 8000 — shorter values race the screenshot gate. */
export const LOADER_DURATION_MS = 8000;

/** Safe inset + header geometry (dp). */
export const TOP_INSET = 44;
export const HEADER_H = 72;
export const MENU_HEADER_H = 56;
export const BOTTOM_INSET = 24;
export const H_PADDING = 16;

/** Lake viewport frame — parent padding + border accounted for (rule 4/5). */
export const VIEWPORT_W = Math.min(SCREEN_W - 32, 380);
export const VIEWPORT_PAD = 6;
export const VIEWPORT_BORDER = 2;
export const VIEWPORT_FRAME = VIEWPORT_PAD + VIEWPORT_BORDER;
export const VIEWPORT_INNER_W = VIEWPORT_W - 2 * VIEWPORT_FRAME;

/** Bottom control surface. */
export const SWIPE_ZONE_H = COMPACT ? 72 : 88;
export const CONTROLS_GAP = COMPACT ? 4 : 8;
export const CONTROLS_H = COMPACT ? 208 : 232;

/** Touch targets. */
export const TARGET = 48;
export const PRIMARY_H = 56;
export const SECONDARY_H = 48;

/** Throw input. */
export const ANGLE_MIN = 5;
export const ANGLE_MAX = 35;
export const ANGLE_DEFAULT = 16;
export const ANGLE_IDEAL = 14;
export const HEADING_MIN = -25;
export const HEADING_MAX = 25;
export const POWER_DEFAULT = 70;
export const POWER_STEP = 5;

export const SWIPE_MIN_MS = 60;
export const SWIPE_MAX_MS = 900;
export const SWIPE_MIN_DIST = 36;
export const SWIPE_MIN_UP = 24;
export const SWIPE_MAX_OFF_AXIS_DEG = 60;
export const SPEED_MIN = 0.3;
export const SPEED_SPAN = 1.3;

/** Deterministic skip model. */
export const SIM_STEP_MS = 1000 / 60;
export const SINK_SPEED = 3.2;
export const BANK_X = 12;
export const LEAF_RADIUS = 0.65;
export const LEAF_SLOWDOWN = 0.72;
export const MAX_CONTACTS = 24;
export const MAX_THROW_MS = 8000;
export const MAX_SKIPS = 24;
export const SAMPLE_HZ = 30;

/** Match. */
export const DUEL_ROUNDS = 3;
export const DUEL_TURNS = DUEL_ROUNDS * 2;

/** Animation times (ms). */
export const ANIM = {
  fade: 220,
  screen: 200,
  modal: 180,
  press: 100,
  ripple: 600,
  sink: 220,
  resultHold: 450,
  bounce: 220,
  crossfade: 180,
};

export const SPRING = { tension: 140, friction: 12 };

export default {
  LOADER_DURATION_MS,
  VIEWPORT_W,
  VIEWPORT_INNER_W,
  ANGLE_DEFAULT,
};
