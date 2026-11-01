"use client"

import { Accessibility } from "lucide-react"

import { Button } from "@/components/ui/button"

function openAccessibilityMenu() {
  const widgetRoot = document.getElementById("accesskit-widget-root")
  const widgetButton = widgetRoot?.querySelector<HTMLButtonElement>(
    ':scope > button[aria-label="Open accessibility menu"]'
  )

  if (!widgetButton) {
    console.error("AccessKit widget button is not mounted")

    return
  }

  widgetButton.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
      code: "Enter",
    })
  )
}

export function NavbarAccessibilityButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Accessibility settings"
      title="Accessibility settings"
      className="text-primary rounded-full"
      onClick={openAccessibilityMenu}
    >
      <Accessibility />
    </Button>
  )
}
