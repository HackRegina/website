type LinkedInPostCreateRequest = {
  author: string;
  commentary: string;
  visibility: 'PUBLIC';
  distribution: {
    feedDistribution: 'MAIN_FEED';
  };
  content: {
    reference: {
      id: string;
    };
  };
  lifecycleState: 'PUBLISHED';
  isReshareDisabledByAuthor: boolean;
};

export const shareLinkedInEvent = async ({
  eventUrn,
  message,
  accessToken,
  organizationUrn,
}: {
  eventUrn: string;
  message: string;
  accessToken: string;
  organizationUrn: string;
}): Promise<void> => {
  const postData: LinkedInPostCreateRequest = {
    author: organizationUrn,
    commentary: message,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
    },
    content: {
      reference: {
        id: eventUrn,
      },
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: true,
  };

  const response = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'LinkedIn-Version': '202603',
      'X-Restli-Protocol-Version': '2.0.0',
      'X-RestLi-Method': 'create',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LinkedIn Share API returned ${response.status}: ${errorText}`);
  }
};
