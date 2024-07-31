export interface IEventbriteEvent {
  name: {
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
}