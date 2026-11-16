import {
  HEADING_MAX,
  HEADING_MIN,
  SPEED_MIN,
  SPEED_SPAN,
  SWIPE_MAX_MS,
  SWIPE_MAX_OFF_AXIS_DEG,
  SWIPE_MIN_DIST,
  SWIPE_MIN_MS,
  SWIPE_MIN_UP,
} from '../constants/config';
import { clamp } from '../utils/format';
import { ThrowInput } from './types';

export type SwipeSample = {
  /** Horizontal displacement in dp, positive is right. */
  dx: number;
  /** Upward displacement in dp, positive is up. */
  up: number;
  durationMs: number;
};

export type SwipeVerdict =
  | { ok: true; heading: number; power: number }
  | { ok: false; message: string };

/** Converts a raw flick into the same committed parameters the sliders produce. */
export function readSwipe(sample: SwipeSample): SwipeVerdict {
  const { dx, up, durationMs } = sample;
  const distance = Math.sqrt(dx * dx + up * up);

  if (durationMs < SWIPE_MIN_MS || durationMs > SWIPE_MAX_MS) {
    return { ok: false, message: 'Try a short upward flick' };
  }
  if (distance < SWIPE_MIN_DIST || up < SWIPE_MIN_UP) {
    return { ok: false, message: 'Try a short upward flick' };
  }
  const offAxis = Math.abs((Math.atan2(dx, up) * 180) / Math.PI);
  if (offAxis > SWIPE_MAX_OFF_AXIS_DEG) {
    return { ok: false, message: 'Try a short upward flick' };
  }

  const speed = distance / durationMs;
  const power = clamp((speed - SPEED_MIN) / SPEED_SPAN, 0, 1);
  const heading = clamp(offAxis * Math.sign(dx), HEADING_MIN, HEADING_MAX);

  return { ok: true, heading, power };
}

export function makeInput(angle: number, heading: number, power: number): ThrowInput {
  return {
    angle,
    heading: clamp(heading, HEADING_MIN, HEADING_MAX),
    power: clamp(power, 0, 1),
  };
}
