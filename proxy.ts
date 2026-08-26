import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { routes } from '@/lib/route';

export default auth((req) => {
  const { nextUrl } = req;
  const isAdmin = !!req.auth?.user?.isAdmin;

  if (nextUrl.pathname === routes.admin.login()) {
    if (isAdmin) return NextResponse.redirect(new URL(routes.admin.dashboard(), nextUrl));
    return NextResponse.next();
  }
  if (isAdmin) return NextResponse.next();
  if (nextUrl.pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const start = new URL('/api/auth/slack-start', nextUrl);
  start.searchParams.set('callbackUrl', nextUrl.pathname);
  return NextResponse.redirect(start);
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
