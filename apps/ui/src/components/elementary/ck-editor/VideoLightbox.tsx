"use client"

import {
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

export function VideoLightbox({ children }: { children: ReactNode }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const playbackUrl = videoUrl ? getPlaybackUrl(videoUrl) : null

  const openVideo = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return

    const videoButton = target.closest<HTMLButtonElement>("[data-video-embed]")

    if (videoButton) {
      setVideoUrl(videoButton.dataset.videoEmbed ?? null)
    }
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    openVideo(event.target)
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
  }

  return (
    <>
      <div onClick={handleClick} onKeyDown={handleKeyDown}>
        {children}
      </div>
      <Dialog
        open={videoUrl !== null}
        onOpenChange={(open) => !open && setVideoUrl(null)}
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
          {playbackUrl && (
            <div className="h-full">
              <iframe
                className="h-full w-full border-0"
                src={playbackUrl}
                title="Embedded video player"
                allow="autoplay; fullscreen; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onLoad={handleVideoLoad}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function handleVideoLoad(event: SyntheticEvent<HTMLIFrameElement>) {
  const iframe = event.currentTarget
  if (iframe.src.includes("youtube-nocookie.com")) {
    postYoutubeCommand(iframe, "playVideo")

    window.setTimeout(() => {
      postYoutubeCommand(iframe, "unMute")
      postYoutubeCommand(iframe, "playVideo")
    }, 250)
  }
}

function postYoutubeCommand(
  iframe: HTMLIFrameElement,
  func: "playVideo" | "unMute"
) {
  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args: [] }),
    "https://www.youtube-nocookie.com"
  )
}

function getPlaybackUrl(videoUrl: string) {
  const url = new URL(videoUrl)

  url.searchParams.set("autoplay", "1")
  url.searchParams.set("playsinline", "1")

  if (url.hostname === "www.youtube-nocookie.com") {
    url.searchParams.set("mute", "1")
    url.searchParams.set("enablejsapi", "1")
    url.searchParams.set("origin", window.location.origin)
  }

  return url.href
}
