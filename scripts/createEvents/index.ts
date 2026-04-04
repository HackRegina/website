import { Command } from 'commander';
import { createEvents } from './createEvents';
import { printEvents } from './display';
import { generateEvents } from './generateEvents';

const program = new Command();

program
  .name('createEvents')
  .description('Create draft Eventbrite events for the upcoming fiscal year (Apr 2026 - Mar 2027)')
  .option('--dry-run', 'Print event schedule without creating events')
  .action(async (opts: { dryRun?: boolean }) => {
    const events = generateEvents();

    if (opts.dryRun) {
      printEvents(events);
      return;
    }

    const eventsWithUrls = await createEvents(events);
    printEvents(eventsWithUrls);
  });

program.parse();
