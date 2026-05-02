import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const requestUrl = new URL(req.url);
    let url = requestUrl.searchParams.get('url') || undefined;
    if (!url) {
      return NextResponse.json({ message: 'Missing url query parameter' }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok || response.status !== 200) {
      return NextResponse.json({ message: 'Invalid url' }, { status: 400 });
    }
    const html = await response.text();
    const title = html?.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || null;
    const description =
      html?.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/)?.[1] ||
      html?.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/)?.[1] ||
      null;
    const imageRaw =
      html?.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/)?.[1] ||
      html?.match(/<meta[^>]*property="twitter:image"[^>]*content="([^"]*)"[^>]*>/)?.[1] ||
      null;
    const iconRaw = html?.match(/<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/)?.[1] || null;
    const isImageFullUrl = imageRaw?.startsWith('http') || false;
    const isIconFullUrl = iconRaw?.startsWith('http') || false;
    url = url.endsWith('/') ? url.slice(0, -1) : url;
    const separator =
      url.endsWith('/') && (imageRaw?.startsWith('/') || iconRaw?.startsWith('/')) ? '' : '/';
    const image = isImageFullUrl || !imageRaw ? imageRaw : `${url}${separator}${imageRaw}`;
    const icon = isIconFullUrl || !iconRaw ? iconRaw : `${url}${separator}${iconRaw}`;
    return NextResponse.json({ title, description, image, icon });
  } catch (error) {
    console.error('Error fetching website details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website details' },
      { status: 500 },
    );
  }
}
