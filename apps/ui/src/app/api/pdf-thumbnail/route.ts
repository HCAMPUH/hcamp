import { execFile } from "node:child_process"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
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
        "Content-Type": "image/png",
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

    return new Response("Unable to generate PDF thumbnail", {
      status: 502,
      headers: {
        "Cache-Control": "no-store",
      },
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

async function generateThumbnail(pdfUrl: string) {
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
  const tempDir = await mkdtemp(path.join(tmpdir(), "pdf-thumb-"))
  const pdfPath = path.join(tempDir, "source.pdf")
  const outputPrefix = path.join(tempDir, "thumbnail")

  try {
    await writeFile(pdfPath, pdfBuffer)
    await execFileAsync(
      "pdftoppm",
      [
        "-f",
        "1",
        "-l",
        "1",
        "-png",
        "-singlefile",
        "-r",
        "72",
        pdfPath,
        outputPrefix,
      ],
      { timeout: 30000, killSignal: "SIGKILL" }
    )

    const renderedPath = `${outputPrefix}.png`

    return new Uint8Array(await readFile(renderedPath))
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}
