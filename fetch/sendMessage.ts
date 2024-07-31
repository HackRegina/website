import { WebClient } from '@slack/web-api'

const token = process.env.SLACK_BOT_TOKEN

interface IOptions {
  channel?: string
  text: string
}

export const sendMessage = async ({ channel = 'random', text }: IOptions): Promise<void> => {
  if (!token) throw new Error('No token provided')
  if (!text) throw new Error('No text provided')
  const web = new WebClient(token)
  try {
    await web.chat.postMessage({
      channel,
      text,
    })
  } catch (e) {
    console.error(`Failed to send slack notification`, e)
    throw new Error('Failed to send slack notification')
  }
}
