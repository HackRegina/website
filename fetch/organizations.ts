import OrganizationsJSON from '../data/organizations.json';

const token = process.env.GITHUB_TOKEN;

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
}

export interface OrganizationResponse {
  partners: IOrganization[];
  sponsors: IOrganization[];
  organizations: IOrganization[];
}

export const fetchOrganizations = async (): Promise<OrganizationResponse> => {
  const organizations: IOrganization[] = OrganizationsJSON.items.map(
    (org): IOrganization => ({
      name: org.name,
      url: org.url,
      image: org.image
        ? {
            light: org.image.light,
            dark: org.image?.dark || null,
          }
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
    }),
  );
  const partners = organizations.filter((org) => org.is_partner);
  const sponsors: IOrganization[] = organizations.filter((org) => org.is_sponsor);

  if (!token) return { sponsors, partners, organizations };
  // TODO: fetch sponsors from GitHub
  return {
    sponsors,
    partners,
    organizations,
  };
};
