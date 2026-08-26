import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';
import { Slack } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/lib/route';

export const metadata: Metadata = {
  title: 'Admin Sign In - HackRegina',
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: 'You must be an administrator of the HackRegina Slack workspace to sign in.',
};

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { error, callbackUrl } = await searchParams;
  const session = await auth();
  if (session?.user?.isAdmin) redirect(routes.admin.dashboard());

  const redirectTo =
    callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//')
      ? callbackUrl
      : routes.admin.dashboard();

  if (!error) {
    redirect(`/api/auth/slack-start?callbackUrl=${encodeURIComponent(redirectTo)}`);
  }

  const signInWithSlack = async () => {
    'use server';
    await signIn('slack', { redirectTo });
  };

  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>
            Access is limited to administrators of the HackRegina Slack workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="rounded-md border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {ERROR_MESSAGES[error] ?? 'Sign-in failed. Please try again.'}
          </p>
          <form action={signInWithSlack}>
            <Button type="submit" className="w-full gap-2">
              <Slack className="h-5 w-5" />
              Try again with Slack
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
