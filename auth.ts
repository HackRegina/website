import NextAuth from 'next-auth';
import Slack from 'next-auth/providers/slack';
import { isWorkspaceAdmin } from '@/lib/slackAdmin';

const teamId = process.env.SLACK_TEAM_ID;

const TEAM_ID_CLAIM = 'https://slack.com/team_id';
const USER_ID_CLAIM = 'https://slack.com/user_id';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Slack],
  session: { strategy: 'jwt', maxAge: 60 * 60 * 12 },
  trustHost: true,
  pages: { signIn: '/admin/login', error: '/admin/login' },
  callbacks: {
    async signIn({ profile }) {
      const slackTeamId = profile?.[TEAM_ID_CLAIM];
      const slackUserId = profile?.[USER_ID_CLAIM] ?? profile?.sub;
      if (!teamId || slackTeamId !== teamId) return false;
      if (typeof slackUserId !== 'string' || !slackUserId) return false;
      return isWorkspaceAdmin(slackUserId);
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const slackUserId = profile[USER_ID_CLAIM] ?? profile.sub;
        if (typeof slackUserId === 'string' && slackUserId) {
          token.slackUserId = slackUserId;
          token.isAdmin =
            !!teamId && profile[TEAM_ID_CLAIM] === teamId && (await isWorkspaceAdmin(slackUserId));
        } else {
          token.isAdmin = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.isAdmin = !!token.isAdmin;
      session.user.slackUserId = typeof token.slackUserId === 'string' ? token.slackUserId : '';
      return session;
    },
  },
});
