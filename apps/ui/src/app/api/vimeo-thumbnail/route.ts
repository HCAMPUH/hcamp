const VIMEO_OEMBED_URL = "https://vimeo.com/api/oembed.json"
const VIMEO_CDN_HOST = "i.vimeocdn.com"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const videoId = requestUrl.searchParams.get("video")

  if (!videoId || !/^\d+$/.test(videoId)) {
    return new Response("Invalid Vimeo video ID", { status: 400 })
  }

  const fallbackUrl = `https://vumbnail.com/${videoId}.jpg`
  const oembedUrl = new URL(VIMEO_OEMBED_URL)
  oembedUrl.searchParams.set("url", `https://vimeo.com/${videoId}`)

  try {
    const response = await fetch(oembedUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      return Response.redirect(fallbackUrl, 302)
    }

    const data: unknown = await response.json()
    const thumbnailUrl = getVimeoThumbnailUrl(data)

    return Response.redirect(thumbnailUrl ?? fallbackUrl, 302)
  } catch {
    return Response.redirect(fallbackUrl, 302)
  }
}

function getVimeoThumbnailUrl(data: unknown): string | null {
  if (!data || typeof data !== "object" || !("thumbnail_url" in data)) {
    return null
  }

  const thumbnailUrl = data.thumbnail_url

  if (typeof thumbnailUrl !== "string") {
    return null
  }

  try {
    const url = new URL(thumbnailUrl)

    return url.protocol === "https:" && url.hostname === VIMEO_CDN_HOST
      ? url.href
      : null
  } catch {
    return null
  }
}
