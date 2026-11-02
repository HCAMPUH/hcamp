const VIMEO_OEMBED_URL = "https://vimeo.com/api/oembed.json"
const VIMEO_CDN_HOST = "i.vimeocdn.com"
const FALLBACK_THUMBNAIL_URL = "/images/placeholder.png"
const THUMBNAIL_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const videoId = requestUrl.searchParams.get("video")

  if (!videoId || !/^\d+$/.test(videoId)) {
    return new Response("Invalid Vimeo video ID", { status: 400 })
  }

  const oembedUrl = new URL(VIMEO_OEMBED_URL)
  oembedUrl.searchParams.set("url", `https://vimeo.com/${videoId}`)
  oembedUrl.searchParams.set("maxwidth", "1920")
  oembedUrl.searchParams.set("maxheight", "1080")

  try {
    const response = await fetch(oembedUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      return redirectToThumbnail(FALLBACK_THUMBNAIL_URL)
    }

    const data: unknown = await response.json()
    const thumbnailUrls = getVimeoThumbnailUrls(data)

    for (const thumbnailUrl of thumbnailUrls) {
      if (await isAvailable(thumbnailUrl)) {
        return redirectToThumbnail(thumbnailUrl)
      }
    }

    return redirectToThumbnail(FALLBACK_THUMBNAIL_URL)
  } catch {
    return redirectToThumbnail(FALLBACK_THUMBNAIL_URL)
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

function getVimeoThumbnailUrls(data: unknown): string[] {
  if (!data || typeof data !== "object") {
    return []
  }

  const sourceUrl =
    "thumbnail_large_url" in data &&
    typeof data.thumbnail_large_url === "string"
      ? data.thumbnail_large_url
      : "thumbnail_url" in data && typeof data.thumbnail_url === "string"
        ? data.thumbnail_url
        : null

  if (!sourceUrl) {
    return []
  }

  try {
    const url = new URL(sourceUrl)

    if (url.protocol !== "https:" || url.hostname !== VIMEO_CDN_HOST) {
      return []
    }

    const highResolutionUrls = [
      ["1920", "1080"],
      ["1280", "720"],
    ].map(([width, height]) => {
      const highResolutionUrl = new URL(url)

      highResolutionUrl.pathname = highResolutionUrl.pathname.replace(
        /-d_\d+(?:x\d+)?$/,
        () => `-d_${width}x${height}`
      )

      return highResolutionUrl.href
    })

    return [...new Set([...highResolutionUrls, url.href])]
  } catch {
    return []
  }
}

async function isAvailable(url: string) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    })

    return response.ok
  } catch {
    return false
  }
}
