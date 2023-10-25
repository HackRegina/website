import { NextApiRequest, NextApiResponse } from 'next'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  let url =
    typeof query.url === 'string' ? query.url : Array.isArray(query.url) ? query.url[0] : undefined
  if (!url) {
    res.status(400).json({ message: 'Missing url query parameter' })
    return
  }
  try {
    const response = await fetch(url)
    if (!response.ok || response.status !== 200) {
      res.status(400).json({ message: 'Invalid url' })
      return
    }
    // parse html to get title, description, icon without jsdom
    const html = await response.text()
    const title = html?.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || null
    const description =
      html?.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/)?.[1] ||
      html?.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/)?.[1] ||
      null
    const imageRaw =
      html?.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/)?.[1] ||
      html?.match(/<meta[^>]*property="twitter:image"[^>]*content="([^"]*)"[^>]*>/)?.[1] ||
      null
    const iconRaw = html?.match(/<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/)?.[1] || null
    const isImageFullUrl = imageRaw?.startsWith('http') || false
    const isIconFullUrl = iconRaw?.startsWith('http') || false
    // remove slash at the end of url
    url = url.endsWith('/') ? url.slice(0, -1) : url
    const image = isImageFullUrl || !imageRaw ? imageRaw : `${url}${imageRaw}`
    const icon = isIconFullUrl || !iconRaw ? iconRaw : `${url}${iconRaw}`
    res.status(200).json({
      title,
      description,
      image,
      icon,
    })
  } catch {
    res.status(400).json({ message: 'Invalid url' })
    return
  }
}

export default handler
