export interface IEventbriteEvent {
  id: string
  status: 'draft' | 'live'
  name: {
    text: string
  }
  description: {
    text: string
  }
  url: string
  start: {
    local: string
  }
  end: {
    local: string
  }
  venue: {
    name: string
    address: {
      address_1: string
      address_2?: string
      city: string
    }
  }
  venue_id: string
  logo: {
    url: string
  }
}