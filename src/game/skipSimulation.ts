import {
  ANGLE_IDEAL,
  BANK_X,
  LEAF_RADIUS,
  LEAF_SLOWDOWN,
  MAX_CONTACTS,
  MAX_SKIPS,
  MAX_THROW_MS,
  SINK_SPEED,
} from '../constants/config';
import { getLake } from '../constants/lakes';
import { clamp } from '../utils/format';
import {
  Contact,
  EndReason,
  RoundEnvironment,
  Segment,
  ThrowInput,
  ThrowRecording,
  ThrowResult,
} from './types';

let throwCounter = 0;

function nextThrowId(): string {
  throwCounter += 1;
  return 't' + String(Date.now()) + '-' + String(throwCounter);
}

/**
 * Deterministic approachable skip model (see design doc).
 * There is no random success roll after input: the whole path is resolved here
 * and the very same data drives both live rendering and the replay.
 */
export function simulateThrow(
  environment: RoundEnvironment,
  input: ThrowInput,
  pebbleId: string,
): ThrowResult {
  const lake = getLake(environment.lakeId);
  const e = clamp(Math.abs(input.angle - ANGLE_IDEAL) / 21, 0, 1);
  const q = clamp(input.power, 0, 1);
  const phi = (input.heading * Math.PI) / 180;
  const wind = environment.wind;

  let S = (6 + 9 * q) * (1 - 0.45 * e);
  let x = 0;
  let z = 0;
  let t = 0;
  let skips = 0;
  let leafHits = 0;
  let reason: EndReason = 'limit';

  const segments: Segment[] = [];
  const contacts: Contact[] = [];
  const liveLeaves = environment.leaves.map(l => ({ ...l, gone: false }));

  for (let step = 0; step < MAX_CONTACTS; step += 1) {
    const T = 0.22 + 0.018 * S;
    const nx = x + S * Math.sin(phi) * T + 0.1 * wind * T * T;
    const nz = z + S * Math.cos(phi) * T;
    const nt = t + T * 1000;

    if (nt > MAX_THROW_MS) {
      reason = 'limit';
      break;
    }

    segments.push({
      t0: t,
      t1: nt,
      x0: x,
      z0: z,
      x1: nx,
      z1: nz,
      arc: 0.1 + 0.025 * S,
    });

    x = nx;
    z = nz;
    t = nt;

    // Bank exit is processed first.
    if (Math.abs(x) > BANK_X) {
      contacts.push({ t, x, z, kind: 'bank', skips, leafId: -1 });
      reason = 'bank';
      break;
    }

    // Nearest leaf only.
    let hitIndex = -1;
    let hitDist = LEAF_RADIUS;
    for (let i = 0; i < liveLeaves.length; i += 1) {
      const leaf = liveLeaves[i];
      if (leaf.gone) {
        continue;
      }
      const dx = leaf.x - x;
      const dz = leaf.z - z;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d <= hitDist) {
        hitDist = d;
        hitIndex = i;
      }
    }

    if (hitIndex >= 0) {
      liveLeaves[hitIndex].gone = true;
      leafHits += 1;
      S = S * LEAF_SLOWDOWN;
      contacts.push({ t, x, z, kind: 'leaf', skips, leafId: liveLeaves[hitIndex].id });
    } else if (S >= SINK_SPEED) {
      skips = Math.min(MAX_SKIPS, skips + 1);
      S = S * (0.91 - 0.09 * e - lake.roughness) - 0.025 * Math.abs(wind);
      contacts.push({ t, x, z, kind: 'skip', skips, leafId: -1 });
    } else {
      contacts.push({ t, x, z, kind: 'sink', skips, leafId: -1 });
      reason = 'sink';
      break;
    }

    if (S < SINK_SPEED) {
      contacts.push({ t, x, z, kind: 'sink', skips, leafId: -1 });
      reason = 'sink';
      break;
    }
  }

  const recording: ThrowRecording = {
    throwId: nextThrowId(),
    lakeId: environment.lakeId,
    pebbleId,
    environment,
    input,
    segments,
    contacts,
    durationMs: Math.max(1, t),
  };

  return {
    throwId: recording.throwId,
    lakeId: environment.lakeId,
    pebbleId,
    skips,
    reason,
    leafHits,
    input,
    wind,
    recording,
  };
}

export type FramePose = { x: number; z: number; height: number; done: boolean };

/** Reconstructs the pebble pose at an arbitrary simulation time. */
export function poseAt(recording: ThrowRecording, timeMs: number): FramePose {
  const segs = recording.segments;
  if (segs.length === 0) {
    return { x: 0, z: 0, height: 0, done: true };
  }
  if (timeMs >= recording.durationMs) {
    const last = segs[segs.length - 1];
    return { x: last.x1, z: last.z1, height: 0, done: true };
  }
  for (let i = 0; i < segs.length; i += 1) {
    const s = segs[i];
    if (timeMs <= s.t1) {
      const span = Math.max(1, s.t1 - s.t0);
      const u = clamp((timeMs - s.t0) / span, 0, 1);
      return {
        x: s.x0 + (s.x1 - s.x0) * u,
        z: s.z0 + (s.z1 - s.z0) * u,
        height: s.arc * Math.sin(Math.PI * u),
        done: false,
      };
    }
  }
  const last = segs[segs.length - 1];
  return { x: last.x1, z: last.z1, height: 0, done: true };
}

/** Number of skips already landed at a given simulation time. */
export function skipsAt(contacts: Contact[], timeMs: number): number {
  let n = 0;
  for (let i = 0; i < contacts.length; i += 1) {
    if (contacts[i].t <= timeMs && contacts[i].kind === 'skip') {
      n = contacts[i].skips;
    }
  }
  return n;
}
