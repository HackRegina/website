import { DateTime } from 'luxon'
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
  const { events = [] } = await response.json()
  const venueMap = new Map()
  await Promise.all(events.reduce((venueIds: string[], event: IEventbriteEvent) => venueIds.includes(event.venue_id) ? venueIds : [...venueIds, event.venue_id], []).map(async (venueId: string) => {
    try {
      if (!venueMap.has(venueId)) {
        const venueResponse = await fetch(`https://www.eventbriteapi.com/v3/venues/${venueId}?token=${token}`)
        const venue = await venueResponse.json()
        venueMap.set(venueId, venue)
      }
    } catch (error) {
      console.error(error)
    }
  }))
  return {
    data: await Promise.all(events.map(async (event: IEventbriteEvent): Promise<IEvent> => {
      const venue = venueMap.get(event.venue_id)
      if (event.status === 'draft') {
        return {
          id: event.id,
          name: event.name.text,
          status: 'draft',
          start: DateTime.fromISO(event.start.local, { zone: event.start.timezone }).toMillis(),
          end: DateTime.fromISO(event.end.local, { zone: event.end.timezone }).toMillis(),
          summary: event.description.text,
          image: event.logo ? event.logo.url : '',
          venue: venue && {
            place_name: venue.name || 'TBA',
            ...venue.address,
          }
        }
      }
      return {
        id: event.id,
        name: event.name.text,
        status: 'live',
        start: DateTime.fromISO(event.start.local, { zone: event.start.timezone }).toMillis(),
        end: DateTime.fromISO(event.end.local, { zone: event.end.timezone }).toMillis(),
        url: event.url,
        summary: event.description.text,
        image: event.logo ? event.logo.url : '',
        venue: venue && {
          place_name: venue.name || 'TBA',
          ...venue.address,
        }
      }
    })),
  }
}