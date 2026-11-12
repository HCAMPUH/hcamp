"use client"

import dynamic from "next/dynamic"
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createRoot, type Root } from "react-dom/client"

const PDF_THUMBNAIL_ROUTE = "/api/pdf-thumbnail"

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

function PdfThumbnail({ pdfUrl }: PdfThumbnailProps) {
  const [hasError, setHasError] = useState(false)
  const thumbnailUrl = useMemo(() => {
    const nextUrl = new URL(PDF_THUMBNAIL_ROUTE, window.location.origin)
    nextUrl.searchParams.set("pdf", pdfUrl)

    return nextUrl.href
  }, [pdfUrl])

  return (
    <div className="relative block aspect-[16/9] w-full overflow-hidden rounded-md bg-transparent">
      {!hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt=""
          className="block h-full w-full object-contain"
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      ) : (
        <div className="h-full w-full bg-transparent" />
      )}
    </div>
  )
}

type FlipbookErrorBoundaryProps = {
  readonly children: ReactNode
  readonly fallback: ReactNode
  readonly onError: (error: Error) => void
}

type FlipbookErrorBoundaryState = {
  hasError: boolean
}

const getFlipbookDiagnostics = (
  error: Error,
  element: HTMLDivElement | null
) => {
  const rect = element?.getBoundingClientRect()
  const viewport = window.visualViewport

  return {
    message: error.message,
    stack: error.stack,
    container: {
      width: rect?.width ?? 0,
      height: rect?.height ?? 0,
    },
    viewport: {
      width: viewport?.width ?? window.innerWidth,
      height: viewport?.height ?? window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    },
    userAgent: navigator.userAgent,
  }
}

class FlipbookErrorBoundary extends Component<
  FlipbookErrorBoundaryProps,
  FlipbookErrorBoundaryState
> {
  constructor(props: {
    readonly children: ReactNode
    readonly fallback: ReactNode
    readonly onError: (error: Error) => void
  }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    console.error("PDF flipbook failed to render", error)
    this.props.onError(error)
  }

  render() {
    if (this.state.hasError) return this.props.fallback

    return this.props.children
  }
}

function PdfFlipbookInstance({ pdfUrl }: { readonly pdfUrl: string }) {
  const [isActivated, setIsActivated] = useState(false)
  const [isInlineActivated, setIsInlineActivated] = useState(false)
  const [isPortraitViewport, setIsPortraitViewport] = useState(
    () =>
      typeof window !== "undefined" && window.innerHeight > window.innerWidth
  )
  const [isClosing, setIsClosing] = useState(false)
  const [viewerError, setViewerError] = useState<Error | null>(null)
  const [viewerDiagnostics, setViewerDiagnostics] = useState<ReturnType<
    typeof getFlipbookDiagnostics
  > | null>(null)
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

  useEffect(() => {
    if (!isInlineActivated || !isAppleTouchDevice()) return

    const updateViewportOrientation = () => {
      setIsPortraitViewport(window.innerHeight > window.innerWidth)
    }
    const orientation = screen.orientation
    const lockLandscape = async () => {
      if (!orientation?.lock) return

      try {
        await orientation.lock("landscape")
      } catch {
        // iOS Safari may expose the API without permitting locks outside
        // its native fullscreen mode. The inline viewer remains landscape.
      }
    }

    void lockLandscape()
    updateViewportOrientation()
    window.addEventListener("resize", updateViewportOrientation, {
      passive: true,
    })
    window.visualViewport?.addEventListener(
      "resize",
      updateViewportOrientation,
      { passive: true }
    )

    return () => {
      window.removeEventListener("resize", updateViewportOrientation)
      window.visualViewport?.removeEventListener(
        "resize",
        updateViewportOrientation
      )
      if (orientation?.unlock) orientation.unlock()
    }
  }, [isInlineActivated])

  const resetViewer = () => {
    setViewerError(null)
    setViewerDiagnostics(null)
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
      setViewerError(null)
      setIsActivated(true)
      setIsInlineActivated(true)

      return
    }

    try {
      await fullscreenElement.requestFullscreen()
      if (document.fullscreenElement === fullscreenElement) {
        setViewerError(null)
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

  const handleViewerError = (error: Error) => {
    const diagnostics = getFlipbookDiagnostics(error, fullscreenRef.current)
    console.error("PDF flipbook diagnostics", diagnostics)
    setViewerDiagnostics(diagnostics)
    setViewerError(error)
  }

  const retryViewer = () => {
    setViewerError(null)
    setViewerDiagnostics(null)
    setIsActivated(false)
    setIsInlineActivated(false)
    window.setTimeout(() => {
      setIsActivated(true)
      setIsInlineActivated(isAppleTouchDevice())
    }, 0)
  }

  const viewerErrorFallback = (
    <div
      className="ck-pdf-flipbook-viewer flex flex-col items-center justify-center gap-4 rounded-lg p-6 text-center"
      role="alert"
    >
      <p>Unable to display this flipbook on this device.</p>
      {viewerError ? (
        <details className="max-w-full text-left text-xs">
          <summary>Technical details</summary>
          <pre className="mt-2 max-w-full overflow-auto whitespace-pre-wrap">
            {JSON.stringify(viewerDiagnostics, null, 2)}
          </pre>
        </details>
      ) : null}
      <button
        type="button"
        className="ck-pdf-flipbook-retry"
        onClick={retryViewer}
      >
        Retry
      </button>
    </div>
  )

  return (
    <div
      ref={fullscreenRef}
      className={[
        "ck-pdf-flipbook-fullscreen",
        isInlineActivated && "ck-pdf-flipbook-fullscreen--inline",
        isInlineActivated &&
          isPortraitViewport &&
          "ck-pdf-flipbook-fullscreen--portrait",
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
        <span className="ck-pdf-flipbook-thumbnail__read">View</span>
      </button>
      {isActivated ? (
        <FlipbookErrorBoundary
          fallback={viewerErrorFallback}
          onError={handleViewerError}
        >
          {viewerError ? (
            viewerErrorFallback
          ) : (
            <FlipbookViewer
              pdfUrl={pdfUrl}
              shareUrl={pdfUrl}
              disableShare
              onExit={closeInlineViewer}
              className="ck-pdf-flipbook-viewer rounded-lg"
            />
          )}
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
