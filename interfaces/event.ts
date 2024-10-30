interface IDraftEvent {
  name: 'TBA'
  status: 'draft'
  start: number
  end: number
  summary: string
  image: string
}

interface ILiveEvent {
  name: string
  status: 'live'
  start: number
  end: number
  url: string
  summary: string
  image: string
}

export type IEvent = IDraftEvent | ILiveEvent

export interface IEventResponse {}
