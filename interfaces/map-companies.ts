export interface IMapCompaniesItem {
  id: string
  name: string
  website: string
  industry: string
  address: string
  lat: number
  lng: number
  sponsorship: string
  technology: any
}

export interface IMapCompaniesCollection extends Array<IMapCompaniesItem> {}
