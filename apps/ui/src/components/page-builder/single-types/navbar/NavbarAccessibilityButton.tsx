"use client"

import { Accessibility } from "lucide-react"

import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    AccessibilityWidgetAPI?: {
      openWidget: () => void
    }
  }
}

export function NavbarAccessibilityButton() {
  function openAccessibilityWidget() {
    const api = window.AccessibilityWidgetAPI

    if (!api) {
      console.warn("Welcoming Web accessibility widget is not ready")

      return
    }

    api.openWidget()
  }

  return (
    <Button
      id="accessibility-trigger"
      variant="ghost"
      size="icon"
      aria-label="Accessibility settings"
      title="Accessibility settings"
      className="text-primary rounded-full"
      onClick={openAccessibilityWidget}
    >
      <Accessibility />
    </Button>
  )
}
