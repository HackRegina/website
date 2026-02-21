import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchEvents } from '@/fetch/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req;
    const timeFilter =
      typeof query.time_filter === 'string'
        ? query.time_filter
        : Array.isArray(query.time_filter)
          ? query.time_filter[0]
          : 'current_future';
    if (timeFilter !== 'current_future' && timeFilter !== 'past') {
      return res.status(400).json({ error: 'Invalid time filter' });
    }
    const result = await fetchEvents({ timeFilter });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events', data: [] });
  }
}
