import { IEventbriteEvent } from '../interfaces/eventbrite-event'

const token = process.env.EVENTBRITE_TOKEN

export interface EventResponse {
  event: IEventbriteEvent
}

export const fetchEvent = async ({ url }: { url?: string } = {}): Promise<EventResponse> => {
  if (!token) throw new Error('No token provided')
  if (!url) throw new Error('No url provided')
  const response = await fetch(`${url}?token=${token}&expand=venue`)
  const event = await response.json()
  return {
    event,
  }
}
