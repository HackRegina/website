export interface IOrganizationImage {
  light: string
  dark: string | null
}

export enum SponsorTierEnum {
  'fan',
  'supporter',
  'promotor',
  'champion',
}
export type SponsorTier = keyof typeof SponsorTierEnum
export const SponsorTierValues = Object.values(SponsorTierEnum) as SponsorTier[]

export interface IOrganization {
  name: string
  url: string
  image: IOrganizationImage | null
  is_partner: boolean
  is_sponsor: boolean
  sponsor_tier: SponsorTier | null
}
