"use client"

import { useEffect } from "react"

const WIDGET_SCRIPT_URL =
  "https://cdn-01.welcomingweb.com/a11y-widget.bundle.js"
const WIDGET_CONTAINER_ID = "a11y-widget-container"
const HIDE_BUTTON_STYLE_ID = "hcamp-hide-a11y-widget-button"
let isWidgetActive = false

function hideFloatingButton() {
  const container = document.getElementById(WIDGET_CONTAINER_ID)
  const shadowRoot = container?.shadowRoot

  if (!shadowRoot || shadowRoot.getElementById(HIDE_BUTTON_STYLE_ID)) {
    return
  }

  const style = document.createElement("style")
  style.id = HIDE_BUTTON_STYLE_ID
  style.textContent = `
    button[aria-label="Open Accessibility Widget"] {
      display: none !important;
    }
  `
  shadowRoot.append(style)
}

export default function AccessibilityWidget({
  widgetId,
}: {
  readonly widgetId?: string
}) {
  useEffect(() => {
    if (!widgetId || isWidgetActive) {
      return
    }

    isWidgetActive = true

    const script = document.createElement("script")
    script.src = WIDGET_SCRIPT_URL
    script.dataset.widgetId = widgetId
    script.async = true
    document.body.append(script)

    const observer = new MutationObserver(hideFloatingButton)
    observer.observe(document.body, { childList: true, subtree: true })
    hideFloatingButton()

    return () => {
      observer.disconnect()
      script.remove()
      isWidgetActive = false
    }
  }, [widgetId])

  return null
}
