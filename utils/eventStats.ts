import type { IAttendee } from '@/fetch/attendees';
import {
  type AttendanceHistory,
  expectedTurnout,
  getBaseRate,
  predictShowUp,
} from '@/utils/showUpProbability';

export interface AttendeePrediction {
  probability: number;
  isNew: boolean;
  pastRegistrations: number;
  pastCheckins: number;
}

export interface AttendanceSummary {
  registered: number;
  checkedIn: number;
}

export interface TurnoutForecast {
  expected: number;
  baseRate: number;
  eventsConsidered: number;
}

export interface EventStatsPayload {
  summary: AttendanceSummary;
  turnout: TurnoutForecast;
  predictions: Record<string, AttendeePrediction>;
}

export type AttendeePredictions = Map<string, AttendeePrediction>;

export interface EventStats {
  summary: AttendanceSummary;
  turnout: TurnoutForecast;
  predictions: AttendeePredictions;
}

export const isInactiveAttendee = (attendee: IAttendee): boolean =>
  attendee.cancelled || attendee.refunded;

export const buildEventStats = (
  attendees: IAttendee[],
  history: AttendanceHistory,
): EventStatsPayload => {
  const active = attendees.filter((attendee) => !isInactiveAttendee(attendee));
  const predictions: Record<string, AttendeePrediction> = {};
  for (const attendee of active) {
    predictions[attendee.id] = predict(attendee, history);
  }
  return {
    summary: {
      registered: active.length,
      checkedIn: active.filter((attendee) => attendee.checkedIn).length,
    },
    turnout: {
      expected: expectedTurnout(
        Object.values(predictions).map((prediction) => prediction.probability),
      ),
      baseRate: getBaseRate(history),
      eventsConsidered: history.eventsConsidered,
    },
    predictions,
  };
};

export const toEventStats = (payload: EventStatsPayload): EventStats => ({
  ...payload,
  predictions: new Map(Object.entries(payload.predictions)),
});

export const sortByShowUpChance = (
  attendees: IAttendee[],
  predictions: AttendeePredictions | null,
): IAttendee[] =>
  [...attendees].sort((a, b) => {
    const aInactive = isInactiveAttendee(a);
    const bInactive = isInactiveAttendee(b);
    if (aInactive !== bInactive) return aInactive ? 1 : -1;
    const aProbability = predictions?.get(a.id)?.probability;
    const bProbability = predictions?.get(b.id)?.probability;
    if (aProbability !== undefined && bProbability !== undefined && aProbability !== bProbability) {
      return bProbability - aProbability;
    }
    return a.createdAt.localeCompare(b.createdAt);
  });

const predict = (attendee: IAttendee, history: AttendanceHistory): AttendeePrediction => {
  const { probability, isNew, stats } = predictShowUp(attendee.email, history);
  return {
    probability: attendee.checkedIn ? 1 : probability,
    isNew,
    pastRegistrations: stats?.registrations ?? 0,
    pastCheckins: stats?.checkins ?? 0,
  };
};
