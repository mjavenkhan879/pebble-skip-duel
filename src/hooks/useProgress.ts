import { useCallback, useRef, useState } from 'react';
import { INITIAL_PROGRESS, Progress, applyThrow } from '../game/progression';
import { ThrowResult } from '../game/types';
import { STARTER_PEBBLE } from '../constants/pebbles';

export type ApplyInfo = {
  newRecord: boolean;
  matched: boolean;
  previousBest: number | null;
  unlockedPebbleId: string | null;
};

/**
 * In-memory versioned progress snapshot. The scaffold ships no storage package,
 * so nothing here claims a durable write: records live for the session.
 * A ref mirrors the state so applying a throw stays synchronous and is guarded
 * by the throw identifier against a double call.
 */
export default function useProgress() {
  const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS);
  const ref = useRef<Progress>(INITIAL_PROGRESS);

  const write = useCallback((next: Progress) => {
    ref.current = next;
    setProgress(next);
  }, []);

  const commitThrow = useCallback(
    (result: ThrowResult, holder: string): ApplyInfo => {
      const out = applyThrow(ref.current, result, holder);
      write(out.progress);
      return {
        newRecord: out.newRecord,
        matched: out.matched,
        previousBest: out.previousBest,
        unlockedPebbleId: out.unlockedPebbleId,
      };
    },
    [write],
  );

  const equip = useCallback(
    (pebbleId: string) => {
      if (ref.current.unlocked.indexOf(pebbleId) < 0) {
        return;
      }
      write({ ...ref.current, equipped: pebbleId });
    },
    [write],
  );

  const setSound = useCallback(
    (value: boolean) => write({ ...ref.current, sound: value }),
    [write],
  );

  const setHaptics = useCallback(
    (value: boolean) => write({ ...ref.current, haptics: value }),
    [write],
  );

  const reset = useCallback(() => {
    write({
      ...INITIAL_PROGRESS,
      equipped: STARTER_PEBBLE,
      sound: ref.current.sound,
      haptics: ref.current.haptics,
    });
  }, [write]);

  return { progress, commitThrow, equip, setSound, setHaptics, reset };
}
