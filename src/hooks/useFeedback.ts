import { useCallback, useRef } from 'react';
import { Vibration } from 'react-native';

/**
 * Optional short platform haptic, at most one per 100ms.
 * Degrades silently when the device has no vibrator.
 */
export default function useFeedback(enabled: boolean) {
  const last = useRef(0);

  return useCallback(
    (durationMs: number = 10) => {
      if (!enabled) {
        return;
      }
      const now = Date.now();
      if (now - last.current < 100) {
        return;
      }
      last.current = now;
      try {
        Vibration.vibrate(durationMs);
      } catch (err) {
        // No vibrator on this device — ignore.
      }
    },
    [enabled],
  );
}
