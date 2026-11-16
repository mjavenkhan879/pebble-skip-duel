import { DUEL_ROUNDS, DUEL_TURNS } from '../constants/config';
import { DuelTurn } from './types';

/** Round 1: P1 then P2. Round 2: P2 then P1. Round 3: P1 then P2. */
export function buildTurnOrder(): DuelTurn[] {
  const turns: DuelTurn[] = [];
  for (let round = 1; round <= DUEL_ROUNDS; round += 1) {
    const first: 1 | 2 = round === 2 ? 2 : 1;
    const second: 1 | 2 = first === 1 ? 2 : 1;
    turns.push({ index: turns.length, round, player: first, score: null });
    turns.push({ index: turns.length, round, player: second, score: null });
  }
  return turns;
}

export type DuelState = {
  lakeId: number;
  turns: DuelTurn[];
  activeIndex: number;
  appliedThrowIds: string[];
};

export function createDuel(lakeId: number): DuelState {
  return { lakeId, turns: buildTurnOrder(), activeIndex: 0, appliedThrowIds: [] };
}

export function applyTurn(state: DuelState, throwId: string, score: number): DuelState {
  if (state.appliedThrowIds.indexOf(throwId) >= 0) {
    return state;
  }
  if (state.activeIndex >= DUEL_TURNS) {
    return state;
  }
  const turns = state.turns.slice();
  turns[state.activeIndex] = { ...turns[state.activeIndex], score };
  return {
    ...state,
    turns,
    activeIndex: state.activeIndex + 1,
    appliedThrowIds: state.appliedThrowIds.concat(throwId).slice(-32),
  };
}

export function totalFor(state: DuelState, player: 1 | 2): number {
  return state.turns.reduce(
    (sum, t) => (t.player === player && t.score !== null ? sum + t.score : sum),
    0,
  );
}

export function bestFor(state: DuelState, player: 1 | 2): number {
  return state.turns.reduce(
    (best, t) => (t.player === player && t.score !== null ? Math.max(best, t.score) : best),
    0,
  );
}

export function isFinished(state: DuelState): boolean {
  return state.activeIndex >= DUEL_TURNS;
}

export type DuelOutcome = { winner: 0 | 1 | 2; text: string };

export function outcome(state: DuelState): DuelOutcome {
  const t1 = totalFor(state, 1);
  const t2 = totalFor(state, 2);
  if (t1 > t2) {
    return { winner: 1, text: 'Player 1 wins' };
  }
  if (t2 > t1) {
    return { winner: 2, text: 'Player 2 wins' };
  }
  const b1 = bestFor(state, 1);
  const b2 = bestFor(state, 2);
  if (b1 > b2) {
    return { winner: 1, text: 'Player 1 wins on best throw' };
  }
  if (b2 > b1) {
    return { winner: 2, text: 'Player 2 wins on best throw' };
  }
  return { winner: 0, text: 'Friendly draw' };
}

/** The round number of the next turn, 1..3. */
export function activeRound(state: DuelState): number {
  const turn = state.turns[Math.min(state.activeIndex, DUEL_TURNS - 1)];
  return turn ? turn.round : DUEL_ROUNDS;
}

export function activePlayer(state: DuelState): 1 | 2 {
  const turn = state.turns[Math.min(state.activeIndex, DUEL_TURNS - 1)];
  return turn ? turn.player : 1;
}
