"use client"

import dynamic from "next/dynamic"
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"
import { createRoot, type Root } from "react-dom/client"

let pdfWorker: Worker | undefined

const configurePdfWorker = (pdfjs: {
  GlobalWorkerOptions: { workerPort?: Worker | null }
}) => {
  if (!pdfWorker) {
    pdfWorker = new Worker(
      // Turbopack bundles the worker as a same-origin module asset.
      // eslint-disable-next-line unicorn/relative-url-style
      new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" }
    )
  }

  pdfjs.GlobalWorkerOptions.workerPort = pdfWorker
}

const FlipbookViewer = dynamic(
  async () => {
    const { FlipbookViewer: Viewer } = await import("react-pdf-flipbook-viewer")
    const { pdfjs } = await import("react-pdf")

    configurePdfWorker(pdfjs)

    return Viewer
  },
  { ssr: false }
)

type PdfThumbnailProps = {
  readonly pdfUrl: string
}

const isAppleTouchDevice = () => {
  if (typeof navigator === "undefined") return false

  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  )
}

const PdfThumbnail = dynamic<PdfThumbnailProps>(
  async () => {
    const { Document, Page, pdfjs } = await import("react-pdf")

    configurePdfWorker(pdfjs)

    return ({ pdfUrl }: PdfThumbnailProps) => {
      return (
        <Document file={pdfUrl} loading={null} error={null}>
          <Page
            pageNumber={1}
            width={900}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      )
    }
  },
  { ssr: false }
)

class FlipbookErrorBoundary extends Component<{
  readonly children: ReactNode
  readonly onError: () => void
}> {
  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    this.props.onError()
  }

  render() {
    return this.props.children
  }
}

function PdfFlipbookInstance({ pdfUrl }: { readonly pdfUrl: string }) {
  const [isActivated, setIsActivated] = useState(false)
  const [isInlineActivated, setIsInlineActivated] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const wasFullscreen = useRef(false)
  const cleanupTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement === fullscreenRef.current) {
        wasFullscreen.current = true

        return
      }

      if (!wasFullscreen.current) return

      wasFullscreen.current = false
      setIsActivated(false)
      setIsClosing(true)

      if (cleanupTimer.current !== undefined) {
        window.clearTimeout(cleanupTimer.current)
      }

      cleanupTimer.current = window.setTimeout(() => {
        setIsClosing(false)
      }, 500)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      if (cleanupTimer.current !== undefined) {
        window.clearTimeout(cleanupTimer.current)
      }
    }
  }, [])

  const resetViewer = () => {
    setIsActivated(false)
    setIsInlineActivated(false)
    setIsClosing(true)

    if (cleanupTimer.current !== undefined) {
      window.clearTimeout(cleanupTimer.current)
    }

    cleanupTimer.current = window.setTimeout(() => {
      setIsClosing(false)
    }, 500)
  }

  const activateFlipbook = async () => {
    if (isClosing) return

    const fullscreenElement = fullscreenRef.current
    if (!fullscreenElement) return

    if (!fullscreenElement.requestFullscreen || isAppleTouchDevice()) {
      setIsActivated(true)
      setIsInlineActivated(true)

      return
    }

    try {
      await fullscreenElement.requestFullscreen()
      if (document.fullscreenElement === fullscreenElement) {
        setIsActivated(true)
        setIsInlineActivated(false)
      }
    } catch {
      setIsActivated(false)
      setIsInlineActivated(false)
    }
  }

  const closeInlineViewer = () => {
    resetViewer()
  }

  const handleViewerError = () => {
    resetViewer()
  }

  return (
    <div
      ref={fullscreenRef}
      className={[
        "ck-pdf-flipbook-fullscreen",
        isInlineActivated && "ck-pdf-flipbook-fullscreen--inline",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className="ck-pdf-flipbook-thumbnail"
        onClick={activateFlipbook}
        aria-label="Open PDF flipbook in fullscreen"
        disabled={isClosing}
        hidden={isActivated}
      >
        <PdfThumbnail pdfUrl={pdfUrl} />
        <span className="ck-pdf-flipbook-thumbnail__read" aria-hidden="true">
          View
        </span>
      </button>
      {isActivated ? (
        <FlipbookErrorBoundary onError={handleViewerError}>
          <FlipbookViewer
            pdfUrl={pdfUrl}
            shareUrl={pdfUrl}
            disableShare
            className="ck-pdf-flipbook-viewer rounded-lg"
          />
          {isInlineActivated ? (
            <button
              type="button"
              className="ck-pdf-flipbook-inline-close"
              onClick={closeInlineViewer}
              aria-label="Close PDF flipbook"
            >
              Close
            </button>
          ) : null}
        </FlipbookErrorBoundary>
      ) : null}
    </div>
  )
}

type MountedFlipbook = {
  readonly root: Root
  generation: number
}

export function PdfFlipbookRenderer({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mountedFlipbooks = useRef(new Map<HTMLElement, MountedFlipbook>())
  const generation = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const mountedRoots = mountedFlipbooks.current
    const currentGeneration = ++generation.current
    const activeElements = new Set(
      container.querySelectorAll<HTMLElement>(
        ":scope .ck-flipbook-renderer[data-flipbook-pdf]"
      )
    )

    for (const element of activeElements) {
      const pdfUrl = element.dataset.flipbookPdf
      if (!pdfUrl) continue

      let mountedFlipbook = mountedRoots.get(element)
      if (!mountedFlipbook) {
        mountedFlipbook = {
          root: createRoot(element),
          generation: currentGeneration,
        }
        mountedRoots.set(element, mountedFlipbook)
      } else {
        mountedFlipbook.generation = currentGeneration
      }

      mountedFlipbook.root.render(<PdfFlipbookInstance pdfUrl={pdfUrl} />)
    }

    return () => {
      queueMicrotask(() => {
        for (const [element, mountedFlipbook] of mountedRoots) {
          if (mountedFlipbook.generation !== currentGeneration) continue

          mountedFlipbook.root.unmount()
          mountedRoots.delete(element)
        }
      })
    }
  }, [children])

  return <div ref={containerRef}>{children}</div>
}
