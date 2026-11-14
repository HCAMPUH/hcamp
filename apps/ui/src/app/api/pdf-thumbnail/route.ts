const THUMBNAIL_CACHE_CONTROL =
  "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800"
const inFlightThumbnails = new Map<string, Promise<Uint8Array>>()

export const runtime = "nodejs"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const pdfUrl = requestUrl.searchParams.get("pdf")

  if (!pdfUrl) {
    return new Response("Missing pdf URL", { status: 400 })
  }

  let normalizedPdfUrl: URL
  try {
    normalizedPdfUrl = new URL(pdfUrl, requestUrl.origin)
  } catch {
    return new Response("Invalid pdf URL", { status: 400 })
  }

  if (!/^(https?:)$/.test(normalizedPdfUrl.protocol)) {
    return new Response("Unsupported pdf URL protocol", { status: 400 })
  }

  try {
    const thumbnailBytes = await getOrCreateThumbnail(normalizedPdfUrl.href)

    return new Response(Buffer.from(thumbnailBytes), {
      headers: {
        "Cache-Control": THUMBNAIL_CACHE_CONTROL,
        "Content-Type": "image/svg+xml",
        "Content-Length": String(thumbnailBytes.length),
        "X-Content-Type-Options": "nosniff",
      },
      status: 200,
    })
  } catch (error) {
    console.error("PDF thumbnail generation failed", {
      error: error instanceof Error ? error.message : String(error),
      pdfUrl: normalizedPdfUrl.href,
    })

    const fallback = createPlaceholderSvg(normalizedPdfUrl.pathname)
    const fallbackBytes = Buffer.from(fallback)

    return new Response(fallbackBytes, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "image/svg+xml",
        "Content-Length": String(fallbackBytes.length),
        "X-Content-Type-Options": "nosniff",
      },
      status: 200,
    })
  }
}

async function getOrCreateThumbnail(pdfUrl: string) {
  const existing = inFlightThumbnails.get(pdfUrl)
  if (existing) {
    return existing
  }

  const pending = generateThumbnail(pdfUrl)
  inFlightThumbnails.set(pdfUrl, pending)

  try {
    return await pending
  } finally {
    inFlightThumbnails.delete(pdfUrl)
  }
}

async function generateThumbnail(pdfUrl: string): Promise<Uint8Array> {
  const response = await fetch(pdfUrl, {
    headers: {
      Accept: "application/pdf, application/octet-stream, */*",
    },
    cache: "force-cache",
    signal: AbortSignal.timeout(20000),
  })

  if (!response.ok) {
    throw new Error(`PDF fetch failed with status ${response.status}`)
  }

  const pdfBuffer = Buffer.from(await response.arrayBuffer())

  if (!pdfBuffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
    throw new Error("Downloaded content is not a PDF")
  }

  const url = new URL(pdfUrl)
  const placeholderSvg = createPlaceholderSvg(url.pathname)

  return new Uint8Array(Buffer.from(placeholderSvg))
}

function createPlaceholderSvg(pdfPath: string) {
  const fileName = decodeURIComponent(
    pdfPath
      .split("/")
      .at(-1)
      ?.replace(/\.[^.]+$/, "") || "PDF"
  )
  const label = fileName.slice(0, 18) || "PDF"

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img" aria-label="PDF document preview unavailable" style="background: transparent;">
      <rect width="1280" height="720" fill="transparent"/>
      <text x="640" y="360" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="transparent">${escapeXml(label)}</text>
    </svg>
  `.trim()
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}
