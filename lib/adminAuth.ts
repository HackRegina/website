import type { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { routes } from '@/lib/route';

export const requireAdmin = async (): Promise<Session | null> => {
  const session = await auth();
  return session?.user?.isAdmin ? session : null;
};

export const requireAdminOrRedirect = async (): Promise<Session> => {
  const session = await requireAdmin();
  if (!session) redirect(routes.admin.login());
  return session;
};
