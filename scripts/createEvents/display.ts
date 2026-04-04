import type { PlannedEvent } from './generateEvents';

function formatTimeRange(startHour: number, endHour: number): string {
  const startSuffix = startHour < 12 ? 'am' : 'pm';
  const endSuffix = endHour < 12 ? 'am' : 'pm';
  const start12 = startHour % 12 || 12;
  const end12 = endHour % 12 || 12;

  if (startSuffix === endSuffix) {
    return `${start12} - ${end12}${endSuffix}`;
  }
  return `${start12}${startSuffix} - ${end12}${endSuffix}`;
}

export function formatEventDisplay(event: PlannedEvent): string {
  const { template, date, displayName } = event;
  const timeRange = formatTimeRange(template.startHour, template.endHour);
  const onSaleFmt = date.minus({ days: template.onSaleDaysBefore }).toFormat('MMMM d, yyyy');

  return [
    `${displayName} \u22c5 ${date.toFormat('EEEE, MMMM d, yyyy')} \u22c5 ${timeRange}`,
    template.venue.displayLine,
    `On sale: ${onSaleFmt}`,
  ].join('\n');
}

export function printEvents(events: (PlannedEvent & { url?: string })[]) {
  let currentYear = 0;
  for (const event of events) {
    if (event.date.year !== currentYear) {
      if (currentYear !== 0) console.log('');
      currentYear = event.date.year;
      console.log(currentYear);
    }
    console.log(formatEventDisplay(event));
    if (event.url) console.log(event.url);
    console.log('');
  }
}
