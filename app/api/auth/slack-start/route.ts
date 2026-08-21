import { signIn } from '@/auth';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const callbackUrl = url.searchParams.get('callbackUrl');
  const redirectTo =
    callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//') ? callbackUrl : '/admin';
  await signIn('slack', { redirectTo });
}
