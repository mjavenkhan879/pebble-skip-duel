import { BANK_X } from '../constants/config';

export type Frame = { w: number; h: number };

export type Projected = { sx: number; sy: number; scale: number };

/**
 * Oblique view toward the far shore: world metres to viewport dp.
 * Gameplay collision never uses these screen coordinates.
 */
export function project(x: number, z: number, frame: Frame): Projected {
  const depth = z / (z + 30);
  const horizonY = frame.h * 0.16;
  const nearY = frame.h * 0.9;
  const sy = nearY - (nearY - horizonY) * depth;
  const spread = frame.w * 0.44 * (1 - depth * 0.78);
  const sx = frame.w / 2 + (x / BANK_X) * spread;
  const scale = 1 - depth * 0.82;
  return { sx, sy, scale };
}

/** Vertical lift in dp for a pebble height expressed in metres. */
export function liftPx(height: number, scale: number, frame: Frame): number {
  return height * frame.h * 0.09 * scale;
}
