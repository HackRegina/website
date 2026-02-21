import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchMembers } from '@/fetch/members';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req;
    const cursor =
      typeof query.cursor === 'string'
        ? query.cursor
        : Array.isArray(query.cursor)
          ? query.cursor[0]
          : undefined;
    const data = await fetchMembers({ cursor });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members', members: [], cursor: null });
  }
}
