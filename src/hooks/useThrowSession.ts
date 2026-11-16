import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ANIM, ANGLE_DEFAULT } from '../constants/config';
import { buildEnvironment } from '../game/roundEnvironment';
import { poseAt, simulateThrow, skipsAt } from '../game/skipSimulation';
import { Contact, ThrowInput, ThrowPhase, ThrowResult } from '../game/types';

const TICK_MS = 32;

export type ThrowSession = {
  environment: ReturnType<typeof buildEnvironment>;
  phase: ThrowPhase;
  angle: number;
  setAngle: (deg: number) => void;
  skips: number;
  simTime: number;
  pose: { x: number; z: number; height: number };
  contacts: Contact[];
  commit: (input: ThrowInput) => void;
  paused: boolean;
  setPaused: (value: boolean) => void;
};

type Params = {
  lakeId: number;
  sessionSeed: number;
  roundCounter: number;
  pebbleId: string;
  initialAngle?: number;
  onSkip?: () => void;
  onComplete: (result: ThrowResult) => void;
};

/**
 * Owns one aiming-to-completed throw. Timing-sensitive values live in refs;
 * the committed path is resolved once and then replayed frame by frame.
 */
export default function useThrowSession(params: Params): ThrowSession {
  const { lakeId, sessionSeed, roundCounter, pebbleId, onComplete, onSkip } = params;

  const environment = useMemo(
    () => buildEnvironment(lakeId, sessionSeed, roundCounter),
    [lakeId, sessionSeed, roundCounter],
  );

  const [angle, setAngle] = useState(params.initialAngle || ANGLE_DEFAULT);
  const [phase, setPhase] = useState<ThrowPhase>('aiming');
  const [paused, setPaused] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [skips, setSkips] = useState(0);

  const resultRef = useRef<ThrowResult | null>(null);
  const timeRef = useRef(0);
  const lastWallRef = useRef(0);
  const skipRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const doneRef = useRef(false);

  pausedRef.current = paused;

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
      if (endRef.current !== null) {
        clearTimeout(endRef.current);
      }
    };
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) {
      return;
    }
    doneRef.current = true;
    stopTimer();
    setPhase('sinking');
    endRef.current = setTimeout(() => {
      setPhase('completed');
      const res = resultRef.current;
      if (res) {
        onComplete(res);
      }
    }, ANIM.sink + ANIM.resultHold);
  }, [onComplete, stopTimer]);

  const commit = useCallback(
    (input: ThrowInput) => {
      if (phase !== 'aiming' || doneRef.current) {
        return;
      }
      const result = simulateThrow(environment, input, pebbleId);
      resultRef.current = result;
      timeRef.current = 0;
      skipRef.current = 0;
      lastWallRef.current = Date.now();
      setSkips(0);
      setSimTime(0);
      setPhase('flying');

      timerRef.current = setInterval(() => {
        const now = Date.now();
        const delta = now - lastWallRef.current;
        lastWallRef.current = now;
        if (pausedRef.current) {
          return;
        }
        const rec = result.recording;
        timeRef.current = Math.min(rec.durationMs, timeRef.current + delta);
        setSimTime(timeRef.current);

        const landed = skipsAt(rec.contacts, timeRef.current);
        if (landed !== skipRef.current) {
          skipRef.current = landed;
          setSkips(landed);
          if (onSkip) {
            onSkip();
          }
        }
        if (timeRef.current >= rec.durationMs) {
          finish();
        }
      }, TICK_MS);
    },
    [environment, finish, onSkip, pebbleId, phase],
  );

  const pose = useMemo(() => {
    const rec = resultRef.current ? resultRef.current.recording : null;
    if (!rec) {
      return { x: 0, z: 0, height: 0 };
    }
    const p = poseAt(rec, simTime);
    return { x: p.x, z: p.z, height: p.height };
  }, [simTime]);

  const contacts = resultRef.current ? resultRef.current.recording.contacts : EMPTY_CONTACTS;

  return {
    environment,
    phase,
    angle,
    setAngle,
    skips,
    simTime,
    pose,
    contacts,
    commit,
    paused,
    setPaused,
  };
}

const EMPTY_CONTACTS: Contact[] = [];
