import { fetchAdminEventById, type IAdminEvent } from '@/fetch/adminEvents';
import { fetchAttendanceHistory } from '@/fetch/attendanceHistory';
import { fetchAttendeesForEvent, type IAttendee } from '@/fetch/attendees';
import { expectedTurnout, getBaseRate, predictShowUp } from '@/utils/showUpProbability';

export interface IAttendeeWithPrediction extends IAttendee {
  probability: number | null;
  isNew: boolean;
  pastRegistrations: number;
  pastCheckins: number;
}

export interface AttendeeReportSummary {
  total: number;
  cancelled: number;
  checkedIn: number;
  expectedTurnout: number;
  baseRate: number;
  eventsConsidered: number;
  generatedAt: number;
}

export interface AttendeeReport {
  event: IAdminEvent;
  attendees: IAttendeeWithPrediction[];
  summary: AttendeeReportSummary;
}

export const getAttendeeReport = async (eventId: string): Promise<AttendeeReport> => {
  const [event, attendees, history] = await Promise.all([
    fetchAdminEventById(eventId),
    fetchAttendeesForEvent(eventId),
    fetchAttendanceHistory(),
  ]);

  const enriched: IAttendeeWithPrediction[] = attendees.map((attendee) => {
    const inactive = attendee.cancelled || attendee.refunded;
    const prediction = predictShowUp(attendee.email, history);
    return {
      ...attendee,
      probability: inactive ? null : attendee.checkedIn ? 1 : prediction.probability,
      isNew: prediction.isNew,
      pastRegistrations: prediction.stats?.registrations ?? 0,
      pastCheckins: prediction.stats?.checkins ?? 0,
    };
  });

  enriched.sort((a, b) => {
    if (a.probability === null && b.probability === null) return 0;
    if (a.probability === null) return 1;
    if (b.probability === null) return -1;
    return b.probability - a.probability;
  });

  const active = enriched.filter((attendee) => attendee.probability !== null);
  return {
    event,
    attendees: enriched,
    summary: {
      total: attendees.length,
      cancelled: attendees.length - active.length,
      checkedIn: active.filter((attendee) => attendee.checkedIn).length,
      expectedTurnout: expectedTurnout(active.map((attendee) => attendee.probability ?? 0)),
      baseRate: getBaseRate(history),
      eventsConsidered: history.eventsConsidered,
      generatedAt: history.generatedAt,
    },
  };
};
