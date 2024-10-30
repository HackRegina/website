import { IEvent, IEventResponse } from '../interfaces/event'
import { IEventbriteEvent } from '../interfaces/eventbrite-event'

const token = process.env.EVENTBRITE_TOKEN

export interface IEventBriteResponse {
  event: IEventbriteEvent
}

export const fetchEventByUrl = async ({ url }: { url?: string } = {}): Promise<IEventBriteResponse> => {
  if (!token) throw new Error('No token provided')
  if (!url) throw new Error('No url provided')
  const response = await fetch(`${url}?token=${token}&expand=venue`)
  const event = await response.json()
  return {
    event,
  }
}

export const fetchEvents = async ({ time_filter }: { time_filter: 'current_future' | 'past' }): Promise<IEventResponse> => {
  if (!token) throw new Error('No token provided')
  const response = await fetch(`https://www.eventbriteapi.com/v3/organizations/168322805152/events?token=${token}&time_filter=${time_filter}`)
  const { events = [], ...rest } = await response.json()
  return {
    data: events.map((event: IEventbriteEvent): IEvent => {
      if (event.status === 'draft') {
        return {
          name: 'TBA',
          status: 'draft',
          start: Date.parse(event.start.local),
          end: Date.parse(event.end.local),
          summary: event.name.text,
          image: event.logo ? event.logo.url : '',
        }
      }
      return {
        name: event.name.text,
        status: 'live',
        start: Date.parse(event.start.local),
        end: Date.parse(event.end.local),
        url: event.url,
        summary: event.name.text,
        image: event.logo ? event.logo.url : '',
      }
    }),
  }
}