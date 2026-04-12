'use client';

import { DateTime } from 'luxon';
import Image from 'next/image';
import type React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { IDraftEvent, IEvent, ILiveEvent } from '@/fetch/events';

interface EventListProps {
  events: IEvent[];
}

export const EventList = ({ events = [] }: React.PropsWithChildren<EventListProps>) => {
  if (events.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-60">
      <div className="flex flex-col items-center space-y-5 md:space-y-10">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold leading-tight w-auto">
          <span className="relative inline-block">
            <span className="relative z-10">Upcoming Events</span>
            <span className="absolute bottom-1 left-0 w-full h-[30%] bg-primary-300 dark:bg-primary-700 -z-10" />
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 mt-20 justify-items-center">
        {events.map((event: IEvent) => (
          <div key={event.id} className="w-full max-w-sm">
            {event.status === 'live' && <UpcomingEventCard event={event} />}
            {event.status === 'draft' && <DraftEventCard event={event} />}
          </div>
        ))}
      </div>
    </section>
  );
};

const UpcomingEventCard = ({ event }: { event: ILiveEvent }) => {
  const { name, image, url, venue } = event;
  const bgColor = getEventColor(name);

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <Card className={`${bgColor} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
        <EventImage src={image} alt={name} />
        <CardContent className="p-6 space-y-3">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm">
            {DateTime.fromMillis(event.start).toLocaleString(DateTime.DATETIME_FULL)}
          </p>
          {venue?.place_name && <p className="text-sm">{venue.place_name}</p>}
        </CardContent>
      </Card>
    </a>
  );
};

const DraftEventCard = ({ event }: { event: IDraftEvent }) => {
  const { name } = event;
  const bgColor = getEventColor(name);

  return (
    <Card className={`${bgColor} border-0 shadow-lg`}>
      <DraftEventImage name={name} />
      <CardContent className="p-6 space-y-3">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-sm">
          {DateTime.fromMillis(event.start).toLocaleString(DateTime.DATETIME_FULL)}
        </p>
      </CardContent>
    </Card>
  );
};

const DraftEventImage = ({ name }: { name: string }) => {
  if (name.includes('Code Together')) return <EventImage src="/images/code-together-placeholder.png" alt={name} />;
  if (name.includes('Lunch n\' Learn')) return <EventImage src="/images/lunch-n-learn-placeholder.png" alt={name} />;
  if (name.includes('Battlesnake')) return <EventImage src="/images/battlesnake-placeholder.png" alt={name} />;
  if (name.includes('Beer & Code Together')) return <EventImage src="/images/beer-n-code-placeholder.png" alt={name} />;
  return null;
};

const getEventColor = (name: string): string => {
  if (name.includes('Code Together')) {
    return 'bg-primary-300 dark:bg-primary-700';
  }
  if (name.includes('Lunch n Learn')) {
    return 'bg-secondary-300 dark:bg-secondary-700';
  }
  return 'bg-gray-300 dark:bg-gray-700';
};

const EventImage = ({ src, alt }: { src?: string; alt: string }) => {
  if (!src) {
    return null
  }
  return (
    <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  )
};
