import { getLake } from '../constants/lakes';
import { hashSeed, mulberry32 } from '../utils/seededRandom';
import { LeafSpot, RoundEnvironment } from './types';

/**
 * Builds the wind and the floating leaves for one round.
 * Both duel players of a paired round receive the same roundKey, therefore
 * byte-for-byte equivalent data.
 */
export function buildEnvironment(
  lakeId: number,
  sessionSeed: number,
  roundCounter: number,
): RoundEnvironment {
  const lake = getLake(lakeId);
  const rnd = mulberry32(hashSeed(sessionSeed, roundCounter));

  // Fixed consumption order: wind, then each leaf x, z, rotation.
  const span = lake.maxWind * 2 + 1;
  const wind = Math.floor(rnd() * span) - lake.maxWind;

  const leaves: LeafSpot[] = [];
  let attempts = 0;
  while (leaves.length < lake.leaves && attempts < 100) {
    attempts += 1;
    const x = -10 + rnd() * 20;
    const z = 5 + rnd() * 80;
    const rotation = rnd() * 360;
    let tooClose = false;
    for (let i = 0; i < leaves.length; i += 1) {
      const dx = leaves[i].x - x;
      const dz = leaves[i].z - z;
      if (Math.sqrt(dx * dx + dz * dz) < 1.5) {
        tooClose = true;
        break;
      }
    }
    if (!tooClose) {
      leaves.push({ id: leaves.length, x, z, rotation });
    }
  }
  // Fallback pattern: fixed 2m spacing from x = -8, z = 70.
  let fallback = 0;
  while (leaves.length < lake.leaves) {
    leaves.push({
      id: leaves.length,
      x: -8 + (fallback % 9) * 2,
      z: 70 + Math.floor(fallback / 9) * 2,
      rotation: (fallback * 37) % 360,
    });
    fallback += 1;
  }

  return {
    roundKey: String(sessionSeed) + ':' + String(roundCounter),
    lakeId,
    wind,
    leaves,
  };
}
