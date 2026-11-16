export function skipLabel(n: number): string {
  return n === 1 ? '1 skip' : String(n) + ' skips';
}

export function windLabel(wind: number): string {
  if (wind === 0) {
    return 'Calm 0 m/s';
  }
  return (wind < 0 ? 'Left ' : 'Right ') + String(Math.abs(wind)) + ' m/s';
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function timeLabel(ms: number): string {
  const total = Math.max(0, Math.round(ms / 100) / 10);
  return total.toFixed(1) + 's';
}
