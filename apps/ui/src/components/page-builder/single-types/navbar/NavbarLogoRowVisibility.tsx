"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

export function NavbarLogoRowVisibility({
  children,
}: {
  readonly children: ReactNode
}) {
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)
  const visibilityTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY
      const shouldHide = scrollY > lastScrollY.current && scrollY > 8

      lastScrollY.current = scrollY

      if (visibilityTimeout.current) {
        clearTimeout(visibilityTimeout.current)
      }

      visibilityTimeout.current = setTimeout(() => {
        setIsHidden(shouldHide)
      }, 150)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)

      if (visibilityTimeout.current) {
        clearTimeout(visibilityTimeout.current)
      }
    }
  }, [])

  return (
    <div
      className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
        isHidden
          ? "pointer-events-none max-h-0 opacity-0"
          : "max-h-96 opacity-100"
      }`}
      aria-hidden={isHidden}
    >
      {children}
    </div>
  )
}

NavbarLogoRowVisibility.displayName = "NavbarLogoRowVisibility"

export default NavbarLogoRowVisibility
