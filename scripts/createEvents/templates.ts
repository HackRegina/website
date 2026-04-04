import type { AgendaSlot, FAQ, TicketClassConfig } from '@/fetch/createEvent';

export const TIMEZONE = 'America/Regina';

// --- Venue data (from Eventbrite API) ---

export const VENUES = {
  cultivator: {
    venueId: '276041003',
    displayLine:
      'Cultivator (Powered by Conexus) \u22c5 2375 College Ave, Regina, SK S4P 0S8, Canada',
  },
  lobby: {
    venueId: '296006417',
    displayLine: 'The Lobby Kitchen & Bar \u22c5 2545 S Broad St, Regina, SK S4P 0M9',
  },
};

// --- Event templates (structured content from existing Eventbrite events) ---

export interface EventTemplate {
  name: string;
  summary: string;
  description: string;
  faqs?: FAQ[];
  agenda?: AgendaSlot[];
  venue: (typeof VENUES)[keyof typeof VENUES];
  startHour: number;
  endHour: number;
  ticketClasses: TicketClassConfig[];
  onSaleDaysBefore: number;
  formatId: string;
}

export const EVENT_TEMPLATES = {
  codeTogether: {
    name: 'Code Together',
    summary:
      'A Code Together night is an event to get a group together and work on anything that interests the participants.',
    description:
      '<p>For those that are new to the community, a Code Together night is an event to get a group together and work on anything that interests the participants. This event provides a shared space for participants to either discuss and receive feedback on their projects or just code with peer motivation.</p><p>We could not do this without the support of our partners and sponsors: Offstreet, Open Path Partners, and Innovation Saskatchewan. All ages and experience levels are welcome, but spots are limited, so save your spot today!</p>',
    faqs: [
      {
        question: 'Do I need to bring a laptop?',
        answer:
          'No, but it definitely comes in handy. Most attendees are open to chat, but we recommend bringing a project or goal (learning a language, etc.)',
      },
    ],
    venue: VENUES.cultivator,
    startHour: 17,
    endHour: 21,
    ticketClasses: [{ name: 'General Admission', free: true, quantity_total: 24, donation: false }],
    onSaleDaysBefore: 21,
    formatId: '10',
  },
  beerAndCode: {
    name: 'Beer & Code Together',
    summary:
      'A Code Together night is an event to get a group together and work on anything that interests the participants.',
    description:
      '<p>For those new to the community, a Code Together night is an event to get a group together and work on anything that interests the participants. This event provides a shared space for participants to either discuss and receive feedback on their projects or just code with peer motivation. This special edition of Code Together, Beer &amp; Code Together, will be hosted at The Lobby Kitchen &amp; Bar.</p><p>We could not do this without the support of our partners and sponsors: Offstreet, Open Path Partners, and Innovation Saskatchewan. All ages and experience levels are welcome, but spots are limited, so save your spot today!</p>',
    faqs: [
      {
        question: 'Do I need to bring a laptop?',
        answer:
          'No, but it definitely comes in handy. Most attendees are open to chat, but we recommend bringing a project or goal (learning a language, etc.)',
      },
    ],
    venue: VENUES.lobby,
    startHour: 17,
    endHour: 21,
    ticketClasses: [{ name: 'General Admission', free: true, quantity_total: 16, donation: false }],
    onSaleDaysBefore: 21,
    formatId: '10',
  },
  lunchAndLearn: {
    name: "Lunch n' Learn",
    summary:
      'Come enjoy a free lunch while attending a developer-focused talk with more of our community members.',
    description:
      '<p><strong><strong>E</strong></strong><strong><strong>vent details</strong></strong></p><p>Topic to be announced...</p><p>The talk will be held in the Situation Room at Cultivator, located at 2375 College Ave. Lunch will be provided at the event. We could not have done this without the support of our sponsors and partners: Cultivator, Open Path Partners, Innovation Saskatchewan, Offstreet, David Crossman, Adam Barrett, Blayne Campbell, and Gabriel Martinez. Lunch will be provided at the event. </p>',
    venue: VENUES.cultivator,
    startHour: 12,
    endHour: 13,
    ticketClasses: [{ name: 'General Admission', free: true, quantity_total: 16, donation: false }],
    onSaleDaysBefore: 14,
    formatId: '2',
  },
  battlesnake: {
    name: 'Battlesnake',
    summary: 'Spectate or compete in the most competitive developer event in Saskatchewan',
    description:
      '<p>A competitive game where your code is the controller. All you need is a web server that responds to the Battlesnake API.</p><p><a href="https://play.battlesnake.com/" target="_blank" rel="nofollow noopener noreferrer">Learn more</a></p><p><br></p><h3>For spectators</h3><p>Join us on Wednesday, December 3rd, for an exhilarating display of competitive coding. Watch developers from across the province showcase their skills, maneuvering their Battlesnakes strategically to outwit opponents. The tournament promises intense moments of skillful coding and strategic brilliance, creating a captivating atmosphere for all spectators. Join in the excitement, cheer for your favourite Battlesnakes, and immerse yourself in the dynamic world of this unique programming challenge.</p><p><br></p><h3>For participants</h3><p>Your training starts today. This is your chance to showcase your coding prowess and strategic brilliance in a dynamic multiplayer programming challenge. Throughout the competition, unleash your creativity in crafting efficient Battlesnakes, navigate coding challenges, and vie for victory against talented developers from across the province. As you delve into the exhilarating world of Battlesnake, expect to experience intense rounds, strategic gameplay, and the camaraderie of like-minded coders. Seize this opportunity to not only sharpen your coding skills but also to forge connections within the coding community. The Battlesnake Tournament awaits your innovative strategies and competitive spirit\u2014may the most cunning Battlesnake emerge triumphant!</p><p>With the resource provided, competitors can create their account and deploy a starter project in under 5 minutes:<br><a href="https://docs.battlesnake.com/quickstart" target="_blank" rel="nofollow noopener noreferrer">https://docs.battlesnake.com/quickstart</a></p><p>If you want to get started in a particular language, they have different starter projects here:<br><a href="https://docs.battlesnake.com/starter-projects" target="_blank" rel="nofollow noopener noreferrer">https://docs.battlesnake.com/starter-projects</a></p><p>You can spend anywhere from 1 to 100+ hours training and adjusting your snake to give you the competitive edge. Anyone can join the <a href="https://app.slack.com/client/T59Q6UULC/C01AR2WNBUM" target="_blank" rel="nofollow noopener noreferrer">HackRegina Slack\'s #battlesnake channel</a> for support and chat with other competitors.</p>',
    faqs: [
      {
        question: 'Do I need to know how to program to play Battlesnake?',
        answer:
          "Battlesnake is best for those with beginner-level programming skills and above. To build your own Battlesnake, you'll need to know the basics of responding to web requests in at least one programming language.\n\nIf you're new to programming and want to start learning - awesome",
      },
      {
        question: 'Is Battlesnake only for machine learning and artificial intelligence?',
        answer:
          "Nope, you can use any technology, tools, and algorithms you want to power your Battlesnake! It doesn't have to be built with machine learning or artificial intelligence.",
      },
      {
        question: 'Which cloud provider and region should I use?',
        answer:
          'You can build a successful Battlesnake on almost any cloud provider, hosted anywhere in the world. Your choice of cloud provider has no impact on your ability to play the game and we encourage you to explore and learn new platforms.',
      },
    ],
    agenda: [
      { title: 'Doors Open', description: '', startTime: '18:00', endTime: '18:45' },
      {
        title: 'Student Tournament',
        description: 'Timing may vary based on the number of competitors',
        startTime: '18:45',
        endTime: '19:30',
      },
      {
        title: 'Rookie Tournament',
        description: 'Timing may vary based on the number of competitors',
        startTime: '19:45',
        endTime: '20:30',
      },
      {
        title: 'Veteran Tournament',
        description: 'Timing may vary based on the number of competitors',
        startTime: '20:45',
        endTime: '21:30',
      },
    ],
    venue: VENUES.cultivator,
    startHour: 17,
    endHour: 21,
    ticketClasses: [
      { name: 'Student Participant', free: true, quantity_total: 16, donation: false },
      { name: 'Rookie Participant', free: true, quantity_total: 16, donation: false },
      { name: 'Veteran Participant', free: true, quantity_total: 16, donation: false },
      { name: 'Spectator', free: true, quantity_total: 12, donation: false },
    ],
    onSaleDaysBefore: 21,
    formatId: '10',
  },
} satisfies Record<string, EventTemplate>;

export type EventType = keyof typeof EVENT_TEMPLATES;
