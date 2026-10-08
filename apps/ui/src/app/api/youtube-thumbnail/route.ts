const YOUTUBE_OEMBED_URL = "https://www.youtube.com/oembed"
const YOUTUBE_THUMBNAIL_HOST = "i.ytimg.com"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const videoId = requestUrl.searchParams.get("video")

  if (!videoId || !/^[\w-]+$/.test(videoId)) {
    return new Response("Invalid YouTube video ID", { status: 400 })
  }

  const fallbackUrl = `https://${YOUTUBE_THUMBNAIL_HOST}/vi/${videoId}/hqdefault.jpg`
  const oembedUrl = new URL(YOUTUBE_OEMBED_URL)
  oembedUrl.searchParams.set(
    "url",
    `https://www.youtube.com/watch?v=${videoId}`
  )
  oembedUrl.searchParams.set("format", "json")

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
    const thumbnailUrl = getYouTubeThumbnailUrl(data)

    return Response.redirect(thumbnailUrl ?? fallbackUrl, 302)
  } catch {
    return Response.redirect(fallbackUrl, 302)
  }
}

function getYouTubeThumbnailUrl(data: unknown): string | null {
  if (!data || typeof data !== "object" || !("thumbnail_url" in data)) {
    return null
  }

  const thumbnailUrl = data.thumbnail_url

  if (typeof thumbnailUrl !== "string") {
    return null
  }

  try {
    const url = new URL(thumbnailUrl)

    return url.protocol === "https:" && url.hostname === YOUTUBE_THUMBNAIL_HOST
      ? url.href
      : null
  } catch {
    return null
  }
}
