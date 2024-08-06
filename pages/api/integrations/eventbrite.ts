import { NextApiRequest, NextApiResponse } from 'next'
import { fetchEvent } from '../../../fetch/event'
import { sendMessage } from '../../../fetch/sendMessage'
import { createEventMessage } from '../../../utils/createEventMessage'

const secret = process.env.EVENTBRITE_WEBHOOK_SECRET
export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query, body } = req
    if (query.secret !== secret) throw new Error('Invalid secret')
    const channel = 'events'
    const { event } = await fetchEvent({ url: body.api_url })
    await sendMessage({ channel, text: createEventMessage(event) })
    res.status(200).json({ message: 'Successfully sent message' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to send message' })
  }
}

export default handler
