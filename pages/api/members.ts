import { NextApiRequest, NextApiResponse } from 'next'
import { fetchMembers } from '../../fetch/members'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const cursor =
    typeof query.cursor === 'string'
      ? query.cursor
      : Array.isArray(query.cursor)
      ? query.cursor[0]
      : undefined
  const response = await fetchMembers({ cursor })
  res.status(200).json(response)
}

export default handler