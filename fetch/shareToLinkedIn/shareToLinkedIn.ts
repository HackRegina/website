import type { IEventbriteEvent } from '@/fetch/events';
import { createLinkedInEventMessage } from '@/utils/createLinkedInEventMessage';
import { createLinkedInEvent } from './createLinkedInEvent';
import { communityApp, eventsApp, getAccessToken } from './getAccessToken';
import { shareLinkedInEvent } from './shareLinkedInEvent';

const organizationUrn = process.env.LINKEDIN_ORGANIZATION_URN;

export const shareToLinkedIn = async (event: IEventbriteEvent) => {
  if (!organizationUrn) throw new Error('No LinkedIn organization URN provided');

  const eventsToken = await getAccessToken(eventsApp);
  const communityToken = await getAccessToken(communityApp);

  // const backgroundImage = event.logo?.url
  //   ? await uploadImageToLinkedIn({
  //       imageUrl: event.logo.url,
  //       accessToken: communityToken,
  //       organizationUrn,
  //     })
  //   : undefined;

  const data = await createLinkedInEvent({
    event,
    accessToken: eventsToken,
    organizationUrn,
    // backgroundImage,
  });

  await shareLinkedInEvent({
    message: createLinkedInEventMessage(event),
    eventUrn: data.eventUrn,
    accessToken: communityToken,
    organizationUrn,
  });

  return data;
};
