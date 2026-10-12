const YOUTUBE_THUMBNAIL_HOST = "i.ytimg.com"

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

    return Response.redirect(response.ok ? thumbnailUrl : fallbackUrl, 302)
  } catch {
    return Response.redirect(fallbackUrl, 302)
  }
}
