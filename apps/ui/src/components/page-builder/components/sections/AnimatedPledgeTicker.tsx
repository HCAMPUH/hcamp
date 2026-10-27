"use client"

import { useCallback, useEffect, useRef } from "react"

import { PublicStrapiClient } from "@/lib/strapi-api"

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

const PAGE_SIZE = 12
const SPEED = 35

export function AnimatedPledgeTicker({
  initialPledges,
  statusLabel,
  ariaLabel,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const lastFrameRef = useRef<number | null>(null)
  const nextPageRef = useRef(2)
  const loadingRef = useRef(false)
  const pausedRef = useRef(false)
  const activeRef = useRef(true)
  const queueRef = useRef<PledgeListItem[]>([])

  const appendPage = useCallback(async (page: number) => {
    if (loadingRef.current) return

    loadingRef.current = true
    try {
      const response = (await PublicStrapiClient.fetchAPI(
        `${PublicStrapiClient.getStrapiApiPathByUId("api::pledge.pledge")}/list`,
        { page, pageSize: PAGE_SIZE },
        undefined,
        { useProxy: true }
      )) as {
        data: PledgeListItem[]
        meta: { hasMore: boolean }
      }

      if (activeRef.current && Array.isArray(response.data)) {
        queueRef.current.push(...response.data)
        nextPageRef.current = response.meta?.hasMore ? page + 1 : 1
      }
    } catch (error) {
      console.error("Failed to load animated pledge page", error)
    } finally {
      loadingRef.current = false
    }
  }, [])

  useEffect(() => {
    activeRef.current = true
    void appendPage(nextPageRef.current)

    const track = trackRef.current
    if (!track) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    pausedRef.current = mediaQuery.matches
    const handleMotionChange = () => {
      if (mediaQuery.matches) {
        pausedRef.current = true
      }
    }
    const handlePointerEnter = () => {
      pausedRef.current = true
    }
    const handlePointerLeave = () => {
      pausedRef.current = mediaQuery.matches
    }

    mediaQuery.addEventListener("change", handleMotionChange)
    track.addEventListener("mouseenter", handlePointerEnter)
    track.addEventListener("mouseleave", handlePointerLeave)

    let frameId: number
    const animate = (timestamp: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = timestamp
      const elapsed = Math.min(timestamp - lastFrameRef.current, 100)
      lastFrameRef.current = timestamp

      if (!pausedRef.current) {
        offsetRef.current += (SPEED * elapsed) / 1000

        const firstItem = track.firstElementChild
        if (firstItem) {
          const gap = Number(getComputedStyle(track).columnGap || "0")
          const itemWidth = firstItem.getBoundingClientRect().width + gap

          if (offsetRef.current >= itemWidth) {
            offsetRef.current -= itemWidth
            const next = queueRef.current.shift()
            if (next) {
              firstItem.textContent = formatPledge(next, statusLabel)
            }
            track.append(firstItem)

            if (queueRef.current.length <= 6) {
              void appendPage(nextPageRef.current)
            }
          }
        }

        track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
      }

      frameId = window.requestAnimationFrame(animate)
    }

    frameId = window.requestAnimationFrame(animate)

    return () => {
      activeRef.current = false
      window.cancelAnimationFrame(frameId)
      mediaQuery.removeEventListener("change", handleMotionChange)
      track.removeEventListener("mouseenter", handlePointerEnter)
      track.removeEventListener("mouseleave", handlePointerLeave)
    }
  }, [appendPage, statusLabel])

  if (!initialPledges.length) return null

  return (
    <div className="overflow-hidden whitespace-nowrap" aria-label={ariaLabel}>
      <div
        ref={trackRef}
        className="pledge-ticker flex w-max gap-8 text-xs font-medium text-slate-300 sm:text-sm"
      >
        {initialPledges.map((pledge) => (
          <span key={pledge.documentId} className="shrink-0">
            {formatPledge(pledge, statusLabel)}
          </span>
        ))}
      </div>
    </div>
  )
}

function formatPledge(pledge: PledgeListItem, statusLabel: string) {
  return `${pledge.firstName.charAt(0).toUpperCase()}. ${pledge.lastName.replaceAll(/\b\p{L}/gu, (letter) => letter.toUpperCase())} (${pledge.schoolOrganization}) — ${statusLabel}`
}
