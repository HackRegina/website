import { unstable_cache } from 'next/cache';
import OrganizationsJSON from '../data/organizations.json';

const token = process.env.GITHUB_TOKEN;
const SPONSORS_ORG = 'HackRegina';
const SPONSORSHIP_DURATION_MS = 365 * 24 * 60 * 60 * 1000;

const SPONSORS_QUERY = `
  query HackReginaSponsors($login: String!) {
    organization(login: $login) {
      active: sponsorshipsAsMaintainer(first: 100, activeOnly: true, includePrivate: false) {
        nodes { ...SponsorshipFields }
      }
      all: sponsorshipsAsMaintainer(first: 100, activeOnly: false, includePrivate: false) {
        nodes { ...SponsorshipFields }
      }
    }
  }
  fragment SponsorshipFields on Sponsorship {
    sponsorEntity {
      __typename
      ... on User         { login name avatarUrl url websiteUrl }
      ... on Organization { login name avatarUrl url websiteUrl }
    }
  }
`;

export interface IOrganizationImage {
  light: string;
  dark: string | null;
}

export enum SponsorTierEnum {
  fan,
  supporter,
  promotor,
  champion,
}
export type SponsorTier = keyof typeof SponsorTierEnum;
export const SponsorTierValues = Object.values(SponsorTierEnum) as SponsorTier[];

interface Geometry {
  type: 'Point';
  coordinates: [number, number];
}

export interface IOrganization {
  name: string;
  url: string;
  image: IOrganizationImage | null;
  is_partner: boolean;
  is_sponsor: boolean;
  is_hidden: boolean;
  sponsor_tier: SponsorTier | null;
  industry: string | null;
  address: string | null;
  geometry: Geometry | null;
  technologies: string[];
  github: string | null;
  sponsored_at: string | null;
}

export interface ISponsor {
  name: string;
  url: string;
  image: IOrganizationImage | null;
  avatarUrl: string | null;
  tier: SponsorTier | null;
  is_active: boolean;
  is_organization: boolean;
  is_github: boolean;
}

export interface OrganizationResponse {
  partners: IOrganization[];
  organizations: IOrganization[];
  sponsors: ISponsor[];
}

interface SponsorshipNode {
  sponsorEntity: {
    __typename: 'User' | 'Organization';
    login: string;
    name: string | null;
    avatarUrl: string;
    url: string;
    websiteUrl: string | null;
  } | null;
}

interface IGitHubSponsor {
  login: string;
  name: string | null;
  avatarUrl: string;
  url: string;
  websiteUrl: string | null;
  isOrganization: boolean;
}

export const fetchOrganizations = async (): Promise<OrganizationResponse> => {
  const organizations: IOrganization[] = OrganizationsJSON.items.map(
    (org): IOrganization => ({
      name: org.name,
      url: org.url,
      image: org.image
        ? { light: org.image.light, dark: org.image?.dark || null }
        : null,
      is_partner: org.is_partner,
      is_sponsor: org.is_sponsor,
      is_hidden: !!org.is_hidden,
      sponsor_tier: SponsorTierValues.find((tier) => tier === org.sponsor_tier) || null,
      industry: org.industry || null,
      address: org.address || null,
      geometry: org.geometry?.coordinates
        ? {
            type: 'Point',
            coordinates: [org.geometry.coordinates[0], org.geometry.coordinates[1]],
          }
        : null,
      technologies: org.technologies || [],
      github: org.github || null,
      sponsored_at: org.sponsored_at || null,
    }),
  );

  const partners = organizations.filter((org) => org.is_partner);
  const linkedLogins = new Set(
    organizations
      .map((org) => org.github?.toLowerCase())
      .filter((g): g is string => !!g),
  );

  const { active, past } = await fetchGitHubSponsors();

  const jsonSponsors: ISponsor[] = organizations
    .filter((org) => org.is_sponsor)
    .map((org) => orgToSponsor(org));

  const githubActive: ISponsor[] = active
    .filter((s) => !linkedLogins.has(s.login.toLowerCase()))
    .map((s) => githubToSponsor(s, true));

  const githubPast: ISponsor[] = past
    .filter((s) => !linkedLogins.has(s.login.toLowerCase()))
    .map((s) => githubToSponsor(s, false));

  const sponsors: ISponsor[] = [...jsonSponsors, ...githubActive, ...githubPast];

  return { partners, organizations, sponsors };
};

const isSponsorshipCurrent = (sponsoredAt: string | null): boolean => {
  if (!sponsoredAt) return true;
  const ts = Date.parse(sponsoredAt);
  if (Number.isNaN(ts)) return true;
  return Date.now() - ts < SPONSORSHIP_DURATION_MS;
};

const normalizeWebsite = (url: string | null): string | null => {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const orgToSponsor = (org: IOrganization): ISponsor => ({
  name: org.name,
  url: org.url,
  image: org.image,
  avatarUrl: null,
  tier: org.sponsor_tier,
  is_active: isSponsorshipCurrent(org.sponsored_at),
  is_organization: true,
  is_github: false,
});

const githubToSponsor = (s: IGitHubSponsor, isActive: boolean): ISponsor => ({
  name: s.name || s.login,
  url: s.websiteUrl || s.url,
  image: null,
  avatarUrl: s.avatarUrl,
  tier: 'fan',
  is_active: isActive,
  is_organization: s.isOrganization,
  is_github: true,
});

const mapNode = (n: SponsorshipNode): IGitHubSponsor | null =>
  n?.sponsorEntity
    ? {
        login: n.sponsorEntity.login,
        name: n.sponsorEntity.name ?? null,
        avatarUrl: n.sponsorEntity.avatarUrl,
        url: n.sponsorEntity.url,
        websiteUrl: normalizeWebsite(n.sponsorEntity.websiteUrl ?? null),
        isOrganization: n.sponsorEntity.__typename === 'Organization',
      }
    : null;

const fetchGitHubSponsorsCached = unstable_cache(
  async (): Promise<{ active: IGitHubSponsor[]; past: IGitHubSponsor[] }> => {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SPONSORS_QUERY, variables: { login: SPONSORS_ORG } }),
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = await res.json();
    const fatal = json.errors?.find(
      (e: { type?: string; path?: string[] }) =>
        e.type !== 'FORBIDDEN' || !e.path?.includes('tier'),
    );
    if (fatal) throw new Error(JSON.stringify(json.errors));

    const activeNodes: SponsorshipNode[] = json.data?.organization?.active?.nodes ?? [];
    const allNodes: SponsorshipNode[] = json.data?.organization?.all?.nodes ?? [];
    const active = activeNodes
      .map(mapNode)
      .filter((s): s is IGitHubSponsor => s !== null);
    const activeLogins = new Set(active.map((s) => s.login.toLowerCase()));
    const past = allNodes
      .map(mapNode)
      .filter(
        (s): s is IGitHubSponsor => s !== null && !activeLogins.has(s.login.toLowerCase()),
      );
    return { active, past };
  },
  ['github-sponsors-hackregina-v5'],
  { revalidate: 3600, tags: ['github-sponsors'] },
);

const fetchGitHubSponsors = async (): Promise<{
  active: IGitHubSponsor[];
  past: IGitHubSponsor[];
}> => {
  if (!token) return { active: [], past: [] };
  try {
    return await fetchGitHubSponsorsCached();
  } catch (err) {
    console.error('Failed to fetch GitHub sponsors:', err);
    return { active: [], past: [] };
  }
};
