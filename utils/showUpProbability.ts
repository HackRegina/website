export interface AttendanceStats {
  registrations: number;
  checkins: number;
}

export interface AttendanceHistory {
  byEmail: Record<string, AttendanceStats>;
  totals: AttendanceStats;
  eventsConsidered: number;
  generatedAt: number;
}

export const SMOOTHING_K = 3;
export const DEFAULT_BASE_RATE = 0.5;
const MIN_PROBABILITY = 0.05;
const MAX_PROBABILITY = 0.95;

const clamp = (value: number): number =>
  Math.min(MAX_PROBABILITY, Math.max(MIN_PROBABILITY, value));

export const getBaseRate = (history: AttendanceHistory): number =>
  history.totals.registrations > 0
    ? history.totals.checkins / history.totals.registrations
    : DEFAULT_BASE_RATE;

export interface ShowUpPrediction {
  probability: number;
  isNew: boolean;
  stats: AttendanceStats | null;
}

export const predictShowUp = (
  email: string | null,
  history: AttendanceHistory,
): ShowUpPrediction => {
  const baseRate = getBaseRate(history);
  const stats = email ? (history.byEmail[email.trim().toLowerCase()] ?? null) : null;
  if (!stats || stats.registrations === 0) {
    return { probability: clamp(baseRate), isNew: true, stats: null };
  }
  const probability =
    (stats.checkins + SMOOTHING_K * baseRate) / (stats.registrations + SMOOTHING_K);
  return { probability: clamp(probability), isNew: false, stats };
};

export const expectedTurnout = (probabilities: number[]): number =>
  Math.round(probabilities.reduce((sum, probability) => sum + probability, 0));
