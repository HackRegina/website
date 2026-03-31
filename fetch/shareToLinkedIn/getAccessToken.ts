export type LinkedInAppCredentials = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

export const eventsApp: LinkedInAppCredentials = {
  clientId: process.env.LINKEDIN_EVENTS_CLIENT_ID ?? '',
  clientSecret: process.env.LINKEDIN_EVENTS_CLIENT_SECRET ?? '',
  refreshToken: process.env.LINKEDIN_EVENTS_REFRESH_TOKEN ?? '',
};

export const communityApp: LinkedInAppCredentials = {
  clientId: process.env.LINKEDIN_COMMUNITY_CLIENT_ID ?? '',
  clientSecret: process.env.LINKEDIN_COMMUNITY_CLIENT_SECRET ?? '',
  refreshToken: process.env.LINKEDIN_COMMUNITY_REFRESH_TOKEN ?? '',
};

export const cachedTokens = new Map<string, { value: string; expiresAt: number }>();

export const getAccessToken = async (app: LinkedInAppCredentials): Promise<string> => {
  if (!app.clientId) throw new Error('No LinkedIn client ID provided');
  if (!app.clientSecret) throw new Error('No LinkedIn client secret provided');
  if (!app.refreshToken) throw new Error('No LinkedIn refresh token provided');

  const cacheKey = app.clientId;
  const cached = cachedTokens.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.value;
  }

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: app.refreshToken,
      client_id: app.clientId,
      client_secret: app.clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LinkedIn OAuth token refresh failed ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  cachedTokens.set(cacheKey, {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 60000,
  });
  return data.access_token;
};
