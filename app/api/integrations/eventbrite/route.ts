import { NextResponse } from 'next/server';
import { fetchEventByUrl } from '@/fetch/events';
import { sendMessage } from '@/fetch/sendMessage';
import { shareToLinkedIn } from '@/fetch/shareToLinkedIn';
import { createEventMessage } from '@/utils/createEventMessage';

const secret = process.env.EVENTBRITE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const querySecret = url.searchParams.get('secret');
    if (querySecret !== secret) throw new Error('Invalid secret');

    const body = await req.json();
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

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 });
  }
}
