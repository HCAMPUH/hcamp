"use client"

import {
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type FocusEvent,
  type ReactNode,
} from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

export function VideoLightbox({ children }: { children: ReactNode }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [preloadedVideoUrl, setPreloadedVideoUrl] = useState<string | null>(
    null
  )
  const preloadedIframeRef = useRef<HTMLIFrameElement>(null)
  const modalIframeRef = useRef<HTMLIFrameElement>(null)
  const playbackUrl = videoUrl ? getPlaybackUrl(videoUrl) : null
  const preloadedPlaybackUrl = preloadedVideoUrl
    ? getPlaybackUrl(preloadedVideoUrl, false)
    : null

  const preloadVideo = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return

    const videoButton = target.closest<HTMLButtonElement>("[data-video-embed]")

    const nextVideoUrl = videoButton?.dataset.videoEmbed

    if (nextVideoUrl && isYouTubeUrl(nextVideoUrl)) {
      setPreloadedVideoUrl(nextVideoUrl)
    }
  }

  const openVideo = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return

    const videoButton = target.closest<HTMLButtonElement>("[data-video-embed]")
    const nextVideoUrl = videoButton?.dataset.videoEmbed

    if (!nextVideoUrl) return

    setVideoUrl(nextVideoUrl)

    if (isYouTubeUrl(nextVideoUrl)) {
      postYoutubeCommand(preloadedIframeRef.current, "playVideo")
      postYoutubeCommand(preloadedIframeRef.current, "unMute")
      postYoutubeCommand(preloadedIframeRef.current, "setVolume", [100])
    }
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    openVideo(event.target)
  }

  const handlePointerOver = (event: PointerEvent<HTMLDivElement>) => {
    preloadVideo(event.target)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return

    const videoButton =
      event.target instanceof HTMLElement
        ? event.target.closest<HTMLButtonElement>("[data-video-embed]")
        : null

    if (!videoButton) return

    event.preventDefault()
    setVideoUrl(videoButton.dataset.videoEmbed ?? null)
    preloadVideo(videoButton)
  }

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    preloadVideo(event.target)
  }

  return (
    <>
      <div
        onClick={handleClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onPointerOver={handlePointerOver}
      >
        {children}
      </div>
      {preloadedPlaybackUrl && (
        <iframe
          ref={preloadedIframeRef}
          className={
            videoUrl === preloadedVideoUrl
              ? "pointer-events-auto fixed top-1/2 left-1/2 z-[60] aspect-video w-[96vw] -translate-x-1/2 -translate-y-1/2 rounded-xl sm:w-[min(90vw,80rem)]"
              : "pointer-events-none absolute size-px opacity-0"
          }
          src={preloadedPlaybackUrl}
          title="YouTube video player"
          tabIndex={videoUrl === preloadedVideoUrl ? 0 : -1}
          aria-hidden={videoUrl === preloadedVideoUrl ? undefined : true}
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
      <Dialog
        open={videoUrl !== null}
        onOpenChange={(open) => {
          if (open) {
            return
          }

          stopVideo(modalIframeRef.current, videoUrl)
          stopVideo(preloadedIframeRef.current, preloadedVideoUrl)
          setVideoUrl(null)
          setPreloadedVideoUrl(null)
        }}
      >
        <DialogContent
          className="aspect-video w-[96vw] max-w-[96vw] overflow-hidden rounded-xl border-0 bg-black p-0 shadow-none sm:w-[min(90vw,80rem)] sm:max-w-[80rem]"
          overlayClassName="bg-white bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(0_0_0/0.4)_45%,rgb(0_0_0/0.88)_100%)] backdrop-blur-[20px]"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Video player</DialogTitle>
          <DialogDescription className="sr-only">
            Embedded video player
          </DialogDescription>
          {playbackUrl && videoUrl !== preloadedVideoUrl && (
            <div className="h-full">
              <iframe
                ref={modalIframeRef}
                className="h-full w-full border-0"
                src={playbackUrl}
                title="Embedded video player"
                allow="autoplay; fullscreen; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function isYouTubeUrl(url: string) {
  return url.includes("youtube-nocookie.com") || url.includes("youtube.com")
}

function stopVideo(iframe: HTMLIFrameElement | null, videoUrl: string | null) {
  if (!iframe || !videoUrl) return

  const message = isYouTubeUrl(videoUrl)
    ? { event: "command", func: "stopVideo", args: [] }
    : { method: "unload" }
  const targetOrigin = isYouTubeUrl(videoUrl)
    ? "https://www.youtube-nocookie.com"
    : "https://player.vimeo.com"

  iframe.contentWindow?.postMessage(JSON.stringify(message), targetOrigin)
}

function postYoutubeCommand(
  iframe: HTMLIFrameElement | null,
  func: "playVideo" | "unMute" | "setVolume",
  args: number[] = []
) {
  if (!iframe) return

  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args }),
    "https://www.youtube-nocookie.com"
  )
}

function getPlaybackUrl(videoUrl: string, autoplay = true) {
  const url = new URL(videoUrl)

  url.searchParams.set("autoplay", autoplay ? "1" : "0")
  url.searchParams.set("playsinline", "1")

  if (url.hostname === "www.youtube-nocookie.com") {
    url.searchParams.set("mute", "1")
    url.searchParams.set("enablejsapi", "1")
    url.searchParams.set("origin", window.location.origin)
  }

  return url.href
}
