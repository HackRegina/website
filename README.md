# HackRegina Website

The official website for HackRegina - Regina's tech community hub.

## Tech Stack

- **Framework**: Next.js 16 (Pages Router)
- **Styling**: Tailwind CSS with custom brand colors
- **State Management**: React Query v5
- **Code Quality**: Biome (linter + formatter)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Visualizations**: @visx/hierarchy for member bubble chart
- **Maps**: Mapbox GL (for tech map)

## Getting Started

### Prerequisites

- Node.js 18+ or 22+
- Bun 1.0+ (alternative to npm/yarn)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HackRegina/website.git
cd website
```

2. Install dependencies:
```bash
bun install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API tokens:
- `MAPBOX_ACCESS_TOKEN` - For the tech map feature
- `SLACK_BOT_TOKEN` - For fetching community members
- `EVENTBRITE_PRIVATE_TOKEN` - For fetching events

4. Run the development server:
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run format` - Format code with Biome
- `bun run lint` - Lint code with Biome

## Project Structure

```
├── components/          # React components
│   ├── ErrorBoundary.tsx
│   ├── Footer/
│   ├── Members/         # Community members bubble chart
│   ├── Navbar/
│   ├── SkeletonLoader.tsx
│   └── ui/              # shadcn/ui components
├── contexts/            # React contexts
│   └── ThemeContext.tsx # Dark mode management
├── data/                # Static data files
│   └── organizations.json
├── fetch/               # API fetch functions
├── hooks/               # React Query hooks
├── interfaces/          # TypeScript interfaces
├── pages/               # Next.js pages
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx        # Homepage
├── public/              # Static assets
│   ├── images/
│   └── videos/
├── styles/              # Global styles
│   └── globals.css
└── utils/               # Utility functions
```

## Features

### Homepage
- **Hero Section**: Video showcase with call-to-action
- **Benefits**: Three-column grid highlighting events, connections, and community
- **Partners**: Display of community partners with logos
- **Sponsors**: Tiered sponsor display (Champion, Promotor, Supporter, Fan)
- **Community Visualization**: Interactive bubble chart showing Slack members

### Dark Mode
- System preference detection
- Manual toggle in navigation
- Persistent user preference via localStorage
- Default: Dark mode

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Adaptive layouts for all screen sizes

## Brand Colors

### Red Palette (Primary)
- `brand-red-700`: #77232b (primary CTAs)
- `brand-red-300`: #fca5a5 (accents in light mode)
- Full scale: 50, 100, 300, 500, 700, 900

### Blue Palette (Secondary)
- `brand-blue-700`: #1a365d
- Full scale: 50, 100, 300, 500, 700, 900

## API Routes

The following API routes need to be implemented:

- `/api/events` - Fetch events from Eventbrite
- `/api/members` - Fetch community members from Slack
- `/api/website` - Fetch website metadata

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Format your code (`bun run lint:fix`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the ISC License.

## Community

- **Slack**: [Join HackRegina on Slack](http://joinslack.hackregina.com/)
- **GitHub**: [HackRegina](https://github.com/HackRegina)
- **Twitter**: [@HackRegina](http://twitter.com/HackRegina)
- **Facebook**: [HackRegina](https://www.facebook.com/HackRegina)
- **LinkedIn**: [HackRegina](https://www.linkedin.com/company/hackregina/)

## Acknowledgments

Special thanks to all our partners and sponsors who make HackRegina possible!

