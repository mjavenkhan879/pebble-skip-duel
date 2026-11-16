import { LAKES, getLake } from '../constants/lakes';
import { PEBBLES, STARTER_PEBBLE } from '../constants/pebbles';
import { LakeRecord, ThrowResult } from './types';

export type Progress = {
  version: 1;
  records: Record<number, LakeRecord>;
  unlocked: string[];
  equipped: string;
  processedThrowIds: string[];
  sound: boolean;
  haptics: boolean;
};

export const INITIAL_PROGRESS: Progress = {
  version: 1,
  records: {},
  unlocked: [STARTER_PEBBLE],
  equipped: STARTER_PEBBLE,
  processedThrowIds: [],
  sound: true,
  haptics: true,
};

export type ApplyOutcome = {
  progress: Progress;
  newRecord: boolean;
  matched: boolean;
  previousBest: number | null;
  unlockedPebbleId: string | null;
};

/**
 * Applies one completed throw exactly once. Guarded by the throw identifier so a
 * remount or a reopened result can never rerun scoring or an unlock.
 */
export function applyThrow(
  progress: Progress,
  result: ThrowResult,
  holder: string,
): ApplyOutcome {
  const lake = getLake(result.lakeId);
  const prev = progress.records[result.lakeId];
  const previousBest = prev ? prev.best : null;

  if (progress.processedThrowIds.indexOf(result.throwId) >= 0) {
    return {
      progress,
      newRecord: false,
      matched: false,
      previousBest,
      unlockedPebbleId: null,
    };
  }

  const beatsRecord = prev ? result.skips > prev.best : true;
  const matched = prev ? result.skips === prev.best && result.skips > 0 : false;

  const records = { ...progress.records };
  records[result.lakeId] = {
    best: prev ? Math.max(prev.best, result.skips) : result.skips,
    holder: beatsRecord || !prev ? holder : prev.holder,
    attempts: (prev ? prev.attempts : 0) + 1,
    at: beatsRecord || !prev ? Date.now() : prev.at,
  };

  let unlockedPebbleId: string | null = null;
  let unlocked = progress.unlocked;
  if (result.skips >= lake.target && unlocked.indexOf(lake.pebbleId) < 0) {
    unlockedPebbleId = lake.pebbleId;
    unlocked = unlocked.concat(lake.pebbleId);
  }

  return {
    progress: {
      ...progress,
      records,
      unlocked,
      processedThrowIds: progress.processedThrowIds.concat(result.throwId).slice(-32),
    },
    newRecord: beatsRecord && result.skips > 0,
    matched,
    previousBest,
    unlockedPebbleId,
  };
}

export function lakesPlayed(progress: Progress): number {
  return LAKES.filter(l => progress.records[l.id] && progress.records[l.id].attempts > 0).length;
}

export function paintingsEarned(progress: Progress): number {
  return progress.unlocked.length;
}

export function totalPaintings(): number {
  return PEBBLES.length;
}

export type HintKind = 'leaf' | 'bank' | 'angle' | 'power' | 'aim';

/** First applicable hint: leaf > bank > angle > power > generic. */
export function hintFor(result: ThrowResult): string {
  if (result.leafHits > 0) {
    return 'A floating leaf caught the pebble. Aim between them.';
  }
  if (result.reason === 'bank') {
    return 'That throw ran into the bank. Straighten your flick.';
  }
  if (Math.abs(result.input.angle - 14) > 8) {
    return 'Try an angle closer to 14 degrees for a flatter skip.';
  }
  if (result.input.power < 0.5) {
    return 'A faster flick carries the pebble much further.';
  }
  return 'Small aim changes can carry you farther.';
}

export function resultHeadline(skips: number): string {
  if (skips === 0) {
    return 'A little splash. Try a lower angle.';
  }
  return skips === 1 ? '1 skip' : String(skips) + ' skips';
}
