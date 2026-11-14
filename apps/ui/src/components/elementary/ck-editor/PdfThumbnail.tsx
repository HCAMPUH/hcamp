"use client"

import * as React from "react"

const PDF_THUMBNAIL_ROUTE = "/api/pdf-thumbnail"

export function PdfThumbnail({ pdfUrl }: { readonly pdfUrl: string }) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
    "loading"
  )
  const thumbnailUrl = React.useMemo(() => {
    const nextUrl = new URL(PDF_THUMBNAIL_ROUTE, window.location.origin)
    nextUrl.searchParams.set("pdf", pdfUrl)

    return nextUrl.href
  }, [pdfUrl])

  return (
    <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-md bg-transparent">
      {status !== "error" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt=""
          className="block h-full w-full object-contain"
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => {
            console.error("PDF flipbook thumbnail failed to load", pdfUrl)
            setStatus("error")
          }}
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      ) : (
        <span className="absolute top-2 left-2 text-sm">
          Preview unavailable
        </span>
      )}
      {status !== "loading" && (
        <span className="ck-pdf-flipbook-thumbnail__read">View</span>
      )}
    </div>
  )
}
