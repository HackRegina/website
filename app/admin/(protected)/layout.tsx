import type { Metadata } from 'next';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { requireAdminOrRedirect } from '@/lib/adminAuth';
import { routes } from '@/lib/route';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminOrRedirect();
  const { name, image } = session.user;

  const signOutAction = async () => {
    'use server';
    await signOut({ redirectTo: routes.home() });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Admin</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">HackRegina event management</p>
        </div>
        <div className="flex items-center gap-3">
          {image && <Image src={image} alt="" width={32} height={32} className="rounded-full" />}
          <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
          <form action={signOutAction}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
