'use client';

import { DateTime } from 'luxon';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { ILiveEvent } from '@/fetch/events';

interface FeaturedEventProps {
  event: ILiveEvent;
}

export const FeaturedEvent = ({ event }: FeaturedEventProps) => {
  const { name, image, url, summary, venue } = event;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 md:pt-40" id="feature-event">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 py-20 md:py-28">
        {/* Left Content */}
        <div className="flex-1 space-y-5 md:space-y-10">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold leading-tight">
            <span className="relative inline-block">
              <span className="relative z-10">Join us at our next</span>
              <span className="absolute bottom-1 left-0 w-full h-[30%] bg-primary-300 dark:bg-primary-700 -z-10" />
            </span>
            <br />
            <span className="text-primary-700 dark:text-primary-300">{event.name}</span>
          </h1>

          <div className="mb-4 text-gray-500 dark:text-gray-400">
            <p className="text-xl font-bold">
              {DateTime.fromMillis(event.start).toLocaleString(DateTime.DATETIME_FULL)}
            </p>
            {venue?.place_name && <p>{venue.place_name}</p>}
            {venue?.localized_address_display && <p>{venue.localized_address_display}</p>}
          </div>

          <div className="mb-4">{summary}</div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Button asChild size="lg" className="rounded-full px-6">
              <a href={url} target="_blank" rel="noopener noreferrer">
                Register
              </a>
            </Button>
          </div>
        </div>

        {/* Right Image with Blob */}
        <div className="flex-1 flex justify-center items-center relative w-full">
          {/* Blob Background */}
          <svg
            aria-hidden="true"
            className="absolute w-[150%] h-[150%] -top-[20%] left-0 -z-10 text-primary-100 dark:text-primary-400 hidden md:block"
            viewBox="0 0 578 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
              fill="currentColor"
            />
          </svg>

          {/* Event Image */}
          {image && (
            <div className="relative w-full max-w-sm h-48 rounded-md overflow-hidden">
              <Image src={image} alt={name} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
