import { Command } from 'commander';
import { fetchEventById } from '@/fetch/events';
import { shareToLinkedIn } from '@/fetch/shareToLinkedIn';

const program = new Command();

// Usage: bun run share:linkedin <eventId>
program
  .name('shareEvent')
  .description('Fetch an Eventbrite event by ID and share it on LinkedIn')
  .argument('<eventId>', 'Eventbrite event ID')
  .action(async (eventId: string) => {
    console.log(`Fetching event ${eventId}...`);
    const { event } = await fetchEventById(eventId);
    console.log(`Sharing "${event.name.text}" on LinkedIn...`);
    const linkedInEvent = await shareToLinkedIn(event);
    console.log(
      `Event shared successfully!\n${`https://www.linkedin.com/events/${linkedInEvent.id}/?viewAsMember=true`}`,
    );
  });

program.parse();
