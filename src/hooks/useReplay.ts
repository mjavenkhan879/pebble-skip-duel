import { useCallback, useEffect, useRef, useState } from 'react';
import { poseAt, skipsAt } from '../game/skipSimulation';
import { ThrowRecording } from '../game/types';

const TICK_MS = 32;

/**
 * Playback clock over a stored recording. Playback never invokes scoring,
 * unlocks, environment generation or duel advancement.
 */
export default function useReplay(recording: ThrowRecording | null) {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(0.5);

  const elapsedRef = useRef(0);
  const lastRef = useRef(Date.now());
  const speedRef = useRef(0.5);
  const playingRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  speedRef.current = speed;
  playingRef.current = playing;

  const duration = recording ? recording.durationMs : 0;

  useEffect(() => {
    if (!recording) {
      return undefined;
    }
    lastRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const delta = now - lastRef.current;
      lastRef.current = now;
      if (!playingRef.current) {
        return;
      }
      const next = Math.min(duration, elapsedRef.current + delta * speedRef.current);
      elapsedRef.current = next;
      setElapsed(next);
      if (next >= duration) {
        playingRef.current = false;
        setPlaying(false);
      }
    }, TICK_MS);
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [duration, recording]);

  const seek = useCallback(
    (ms: number) => {
      const next = Math.max(0, Math.min(duration, ms));
      elapsedRef.current = next;
      setElapsed(next);
    },
    [duration],
  );

  const restart = useCallback(() => {
    elapsedRef.current = 0;
    lastRef.current = Date.now();
    setElapsed(0);
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    lastRef.current = Date.now();
    setPlaying(p => !p);
  }, []);

  const pose = recording ? poseAt(recording, elapsed) : { x: 0, z: 0, height: 0, done: true };
  const skips = recording ? skipsAt(recording.contacts, elapsed) : 0;

  return {
    elapsed,
    duration,
    playing,
    speed,
    setSpeed,
    seek,
    restart,
    toggle,
    pose,
    skips,
    finished: duration > 0 && elapsed >= duration,
  };
}
