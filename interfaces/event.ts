interface Venue {
  place_name: string
  address_1: string
  address_2: string
  city: string
  region: string
  postal_code: string
  country: string
  latitude: string
  longitude: string
  localized_address_display: string
  localized_area_display: string
  localized_multi_line_address_display: string[]
}

export interface IDraftEvent {
  id: string
  name: string
  status: 'draft'
  start: number
  end: number
  summary: string
  image: string
  venue?: Venue
}

export interface ILiveEvent {
  id: string
  name: string
  status: 'live'
  start: number
  end: number
  url: string
  summary: string
  image: string
  venue?: Venue
}

export type IEvent = IDraftEvent | ILiveEvent

export interface IEventResponse {
  data: IEvent[]
}
