"use client"

import { useState, type KeyboardEvent, type ReactNode } from "react"

export function NavbarLogoRowAnimation({
  children,
  duration,
}: {
  readonly children: ReactNode
  readonly duration: string
}) {
  const [isPlaying, setIsPlaying] = useState(false)

  function toggleAnimation() {
    setIsPlaying((playing) => !playing)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return

    event.preventDefault()
    toggleAnimation()
  }

  return (
    <div
      className="flex w-max shrink-0 transform-gpu items-center will-change-transform ltr:animate-[navbarMarquee_linear_infinite] rtl:animate-[navbarMarqueeReverse_linear_infinite]"
      style={{
        animationDuration: duration,
        animationPlayState: isPlaying ? "running" : "paused",
      }}
      role="button"
      tabIndex={0}
      aria-label={isPlaying ? "Pause logo animation" : "Play logo animation"}
      onClick={toggleAnimation}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  )
}

NavbarLogoRowAnimation.displayName = "NavbarLogoRowAnimation"

export default NavbarLogoRowAnimation
