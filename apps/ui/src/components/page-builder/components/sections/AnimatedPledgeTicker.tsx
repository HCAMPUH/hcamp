"use client"

import { useEffect, useRef } from "react"

type PledgeListItem = {
  documentId: string
  firstName: string
  lastName: string
  schoolOrganization: string
}

type Props = {
  initialPledges: PledgeListItem[]
  statusLabel: string
  ariaLabel: string
}

const SPEED = 35

export function AnimatedPledgeTicker({
  initialPledges,
  statusLabel,
  ariaLabel,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const cycleRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const cycleWidthRef = useRef(0)
  const lastFrameRef = useRef<number | null>(null)
  const pausedRef = useRef(false)
  const visibleRef = useRef(true)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const track = trackRef.current
    const cycle = cycleRef.current
    if (!track || !cycle) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    pausedRef.current = mediaQuery.matches
    const shouldAnimate = () => !pausedRef.current && visibleRef.current
    const stopAnimation = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      lastFrameRef.current = null
    }
    const updateCycleWidth = () => {
      const width = cycle.getBoundingClientRect().width
      if (!Number.isFinite(width) || width <= 0) return

      const previousWidth = cycleWidthRef.current
      const progress =
        previousWidth > 0 && Number.isFinite(offsetRef.current)
          ? offsetRef.current / previousWidth
          : 0
      cycleWidthRef.current = width
      offsetRef.current = (progress * width) % width
      track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
    }

    const animate = (timestamp: number) => {
      if (!shouldAnimate()) {
        stopAnimation()

        return
      }

      if (lastFrameRef.current === null) lastFrameRef.current = timestamp

      const elapsed = Math.max(
        0,
        Math.min(timestamp - lastFrameRef.current, 100)
      )
      lastFrameRef.current = timestamp

      if (Number.isFinite(cycleWidthRef.current) && cycleWidthRef.current > 0) {
        offsetRef.current =
          (offsetRef.current + (SPEED * elapsed) / 1000) % cycleWidthRef.current

        track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
      }

      frameRef.current = window.requestAnimationFrame(animate)
    }
    const startAnimation = () => {
      if (frameRef.current === null && shouldAnimate()) {
        frameRef.current = window.requestAnimationFrame(animate)
      }
    }
    const handleMotionChange = () => {
      pausedRef.current = mediaQuery.matches
      if (pausedRef.current) stopAnimation()
      else startAnimation()
    }
    const handlePointerEnter = () => {
      pausedRef.current = true
      stopAnimation()
    }
    const handlePointerLeave = () => {
      pausedRef.current = mediaQuery.matches
      startAnimation()
    }
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return

        visibleRef.current = entry.isIntersecting
        if (visibleRef.current) startAnimation()
        else stopAnimation()
      },
      { threshold: 0 }
    )

    mediaQuery.addEventListener("change", handleMotionChange)
    track.addEventListener("mouseenter", handlePointerEnter)
    track.addEventListener("mouseleave", handlePointerLeave)
    intersectionObserver.observe(track)
    const resizeObserver = new ResizeObserver(updateCycleWidth)
    resizeObserver.observe(cycle)
    updateCycleWidth()
    startAnimation()

    return () => {
      stopAnimation()
      mediaQuery.removeEventListener("change", handleMotionChange)
      track.removeEventListener("mouseenter", handlePointerEnter)
      track.removeEventListener("mouseleave", handlePointerLeave)
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
    }
  }, [])

  if (!initialPledges.length) return null

  return (
    <div className="overflow-hidden whitespace-nowrap" aria-label={ariaLabel}>
      <div
        ref={trackRef}
        className="flex w-max text-xs font-medium text-slate-300 sm:text-sm"
      >
        <div ref={cycleRef} className="flex w-max shrink-0 gap-8 pr-8">
          {initialPledges.map((pledge) => (
            <span key={pledge.documentId} className="shrink-0">
              {formatPledge(pledge, statusLabel)}
            </span>
          ))}
        </div>
        <div className="flex w-max shrink-0 gap-8 pr-8" aria-hidden="true">
          {initialPledges.map((pledge) => (
            <span key={`${pledge.documentId}-duplicate`} className="shrink-0">
              {formatPledge(pledge, statusLabel)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatPledge(pledge: PledgeListItem, statusLabel: string) {
  return `${pledge.firstName.charAt(0).toUpperCase()}. ${pledge.lastName.replaceAll(/\b\p{L}/gu, (letter) => letter.toUpperCase())} (${pledge.schoolOrganization}) — ${statusLabel}`
}
