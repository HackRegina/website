import { NextApiRequest, NextApiResponse } from 'next'
import { fetchEvents } from '../../fetch/events'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const timeFilter =
    typeof query.time_filter === 'string'
      ? query.time_filter
      : Array.isArray(query.time_filter)
      ? query.time_filter[0]
      : 'current_future'
  if (timeFilter !== 'current_future' && timeFilter !== 'past') throw new Error('Invalid time filter')
  const response = await fetchEvents({ time_filter: timeFilter })
  res.status(200).json(response)
}

export default handler