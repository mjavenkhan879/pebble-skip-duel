export type Mode = 'solo' | 'duel';

export type ThrowPhase = 'aiming' | 'flying' | 'sinking' | 'completed';

export type LeafSpot = {
  id: number;
  x: number;
  z: number;
  rotation: number;
};

export type RoundEnvironment = {
  roundKey: string;
  lakeId: number;
  /** Signed integer m/s. Positive blows right. Chosen once, never resampled. */
  wind: number;
  leaves: LeafSpot[];
};

export type ThrowInput = {
  /** Launch angle in degrees, 5..35. */
  angle: number;
  /** Heading in degrees, -25..25. Negative is left. */
  heading: number;
  /** Normalised power 0..1. */
  power: number;
};

export type ContactKind = 'skip' | 'leaf' | 'sink' | 'bank';

export type Contact = {
  /** Simulation timestamp in ms from release. */
  t: number;
  x: number;
  z: number;
  kind: ContactKind;
  /** Skip number after this contact, for numbered markers. */
  skips: number;
  leafId: number;
};

export type Segment = {
  t0: number;
  t1: number;
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  /** Arc height in metres at the middle of the segment. */
  arc: number;
};

export type ThrowRecording = {
  throwId: string;
  lakeId: number;
  pebbleId: string;
  environment: RoundEnvironment;
  input: ThrowInput;
  segments: Segment[];
  contacts: Contact[];
  durationMs: number;
};

export type EndReason = 'sink' | 'bank' | 'limit';

export type ThrowResult = {
  throwId: string;
  lakeId: number;
  pebbleId: string;
  skips: number;
  reason: EndReason;
  leafHits: number;
  input: ThrowInput;
  wind: number;
  recording: ThrowRecording;
};

export type LakeRecord = {
  best: number;
  holder: string;
  attempts: number;
  at: number;
};

export type DuelTurn = {
  index: number;
  round: number;
  player: 1 | 2;
  score: number | null;
};
