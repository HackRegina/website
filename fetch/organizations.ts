import OrganizationsJSON from '../data/organizations.json'
import { IOrganization, SponsorTierValues } from '../interfaces/organization'

const token = process.env.GITHUB_TOKEN

export interface OrganizationResponse {
  partners: IOrganization[]
  sponsors: IOrganization[]
}

export const fetchOrganizations = async ({}: Object = {}): Promise<OrganizationResponse> => {
  const partners = OrganizationsJSON.filter((org) => org.is_partner).map((org) => ({
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
    sponsor_tier: SponsorTierValues.find((tier) => tier === org.sponsor_tier) || null,
  }))
  const sponsors: IOrganization[] = OrganizationsJSON.filter((org) => org.is_sponsor).map(
    (org) => ({
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
      sponsor_tier: SponsorTierValues.find((tier) => tier === org.sponsor_tier) || null,
    }),
  )
  if (!token) return { sponsors, partners }
  // TODO: fetch sponsors from GitHub
  return {
    sponsors,
    partners,
  }
}
