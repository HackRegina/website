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
    timezone: string
  }
  end: {
    local: string
    timezone: string
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
  sales_data_with_null?: {
    max_possible_ticket_sales: number
  }
}