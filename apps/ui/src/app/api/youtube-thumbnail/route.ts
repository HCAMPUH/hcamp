const YOUTUBE_THUMBNAIL_HOST = "i.ytimg.com"
const THUMBNAIL_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const videoId = requestUrl.searchParams.get("video")

  if (!videoId || !/^[\w-]+$/.test(videoId)) {
    return new Response("Invalid YouTube video ID", { status: 400 })
  }

  const thumbnailUrl = `https://${YOUTUBE_THUMBNAIL_HOST}/vi/${videoId}/maxresdefault.jpg`
  const fallbackUrl = `https://${YOUTUBE_THUMBNAIL_HOST}/vi/${videoId}/sddefault.jpg`

  try {
    const response = await fetch(thumbnailUrl, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    })

    return redirectToThumbnail(response.ok ? thumbnailUrl : fallbackUrl)
  } catch {
    return redirectToThumbnail(fallbackUrl)
  }
}

function redirectToThumbnail(url: string) {
  return new Response(null, {
    headers: {
      "Cache-Control": THUMBNAIL_CACHE_CONTROL,
      Location: url,
    },
    status: 302,
  })
}
