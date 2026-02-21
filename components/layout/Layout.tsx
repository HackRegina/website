import Head from 'next/head';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export const Layout = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
      </Head>
      <ErrorBoundary>
        <Navbar />

        <main className="grow">{children}</main>

        <Footer />
      </ErrorBoundary>
    </div>
  );
};
