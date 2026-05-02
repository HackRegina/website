import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'HackRegina',
  description:
    'HackRegina is the beginning of a strong and well-known tech community for Regina, SK. The non-profit organization started as a small Slack channel but has begun to grow into a community for software developers to share knowledge and get to know one another.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <ErrorBoundary>
              <Navbar />
              <main className="grow">{children}</main>
              <Footer />
            </ErrorBoundary>
          </div>
        </Providers>
      </body>
    </html>
  );
}
