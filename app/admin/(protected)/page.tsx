import type { Metadata } from 'next';
import { requireAdminOrRedirect } from '@/lib/adminAuth';

export const metadata: Metadata = { title: 'Admin - HackRegina' };

export default async function AdminPage() {
  const session = await requireAdminOrRedirect();
  return (
    <p className="text-gray-700 dark:text-gray-300">
      Signed in as {session.user.name ?? 'unknown user'}. Event management is coming in the next
      update.
    </p>
  );
}
