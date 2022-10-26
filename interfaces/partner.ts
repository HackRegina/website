export interface IPartnerImage {
  light: string
  dark: string
}

export class PartnerImage implements IPartnerImage {
  constructor({ light, dark }: Partial<IPartnerImage>) {
    this.light = light || dark || ''
    this.dark = dark || light || ''
  }
  light: string
  dark: string
}

export interface IPartner {
  name: string
  url: string
  image: IPartnerImage
}
export class Partner implements IPartner {
  constructor({ name, url, image }: Partial<IPartner>) {
    this.name = name || ''
    this.url = url || ''
    this.image = new PartnerImage(image || {})
  }
  name: string
  url: string
  image: IPartnerImage
}
