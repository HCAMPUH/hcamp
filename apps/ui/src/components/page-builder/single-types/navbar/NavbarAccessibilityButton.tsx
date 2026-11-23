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
  return (
    <Button
      id="accessibility-trigger"
      variant="ghost"
      size="icon"
      aria-label="Accessibility settings"
      title="Accessibility settings"
      className="text-primary rounded-full"
    >
      <Accessibility />
    </Button>
  )
}
