import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_TOKEN ?? process.env.SLACK_BOT_TOKEN;

export const isWorkspaceAdmin = async (slackUserId: string): Promise<boolean> => {
  if (!token) {
    console.error('Neither SLACK_TOKEN nor SLACK_BOT_TOKEN is set; denying admin access');
    return false;
  }
  try {
    const web = new WebClient(token);
    const { user } = await web.users.info({ user: slackUserId });
    return !!(user?.is_admin || user?.is_owner || user?.is_primary_owner);
  } catch (error) {
    console.error('Slack users.info failed during admin check', error);
    return false;
  }
};
