export interface IOrganizationImage {
  light: string
  dark?: string
}

export interface IOrganization {
  name: string
  url: string
  image?: IOrganizationImage
  is_partner: boolean
  is_sponsor: boolean
}
