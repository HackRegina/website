import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      isAdmin: boolean;
      slackUserId: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin?: boolean;
    slackUserId?: string;
  }
}
