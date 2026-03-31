import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchEventByUrl } from '@/fetch/events';
import { sendMessage } from '@/fetch/sendMessage';
import { shareToLinkedIn } from '@/fetch/shareToLinkedIn';
import { createEventMessage } from '@/utils/createEventMessage';

const secret = process.env.EVENTBRITE_WEBHOOK_SECRET;
export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query, body } = req;
    if (query.secret !== secret) throw new Error('Invalid secret');
    const channel = 'events';
    const { event } = await fetchEventByUrl({ url: body.api_url });

    const [slackResult, linkedInResult] = await Promise.allSettled([
      sendMessage({ channel, text: createEventMessage(event) }),
      shareToLinkedIn(event),
    ]);

    if (slackResult.status === 'rejected') {
      console.error('Failed to send Slack message:', slackResult.reason);
    }

    if (linkedInResult.status === 'rejected') {
      console.error('Failed to create/share LinkedIn event:', linkedInResult.reason);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

export default handler;
