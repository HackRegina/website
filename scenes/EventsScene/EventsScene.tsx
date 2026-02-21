'use client';

import { useEvents } from '@/hooks/useEvents';
import { EventList, FeaturedEvent } from './components';

export const EventsScene = () => {
  const { events } = useEvents();
  const [featuredEvent, ...remainingEvents] = events;

  return (
    <>
      {featuredEvent?.status === 'live' && <FeaturedEvent event={featuredEvent} />}
      <EventList events={remainingEvents} />
    </>
  );
};
