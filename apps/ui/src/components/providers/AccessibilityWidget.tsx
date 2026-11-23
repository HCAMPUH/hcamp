"use client"

import { useEffect } from "react"

const WIDGET_SCRIPT_URL =
  "https://cdn-01.welcomingweb.com/a11y-widget.bundle.js"
const WIDGET_CONTAINER_ID = "a11y-widget-container"
const HIDE_BUTTON_STYLE_ID = "hcamp-hide-a11y-widget-button"
let isWidgetActive = false
let widgetShadowObserver: MutationObserver | null = null
const fixedStyleElements = new WeakSet<HTMLStyleElement>()

function fixVendorPropertyPrefixes(shadowRoot: ShadowRoot) {
  for (const style of shadowRoot.querySelectorAll<HTMLStyleElement>(
    ":scope style"
  )) {
    if (fixedStyleElements.has(style)) {
      continue
    }

    const originalCss = style.textContent
    if (!originalCss) {
      continue
    }

    fixedStyleElements.add(style)
    const fixedCss = originalCss.replaceAll(
      /(^|[;{])(\s*)webkit-(user-select|appearance)(\s*:)/g,
      "$1$2-webkit-$3$4"
    )
    if (fixedCss !== originalCss) {
      style.textContent = fixedCss
    }
  }
}

function hideFloatingButton() {
  const container = document.getElementById(WIDGET_CONTAINER_ID)
  const shadowRoot = container?.shadowRoot

  if (!shadowRoot) {
    return
  }

  fixVendorPropertyPrefixes(shadowRoot)

  if (!widgetShadowObserver) {
    widgetShadowObserver = new MutationObserver(hideFloatingButton)
    widgetShadowObserver.observe(shadowRoot, { childList: true, subtree: true })
  }

  if (shadowRoot.getElementById(HIDE_BUTTON_STYLE_ID)) {
    return
  }

  const style = document.createElement("style")
  style.id = HIDE_BUTTON_STYLE_ID
  style.textContent = `
    @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
      #a11y-widget .backdrop-filter,
      .backdrop-filter {
        background-color: rgba(0, 0, 0, 0.72) !important;
      }
    }

    @supports not (overflow: clip) {
      #a11y-widget .modal,
      .modal {
        overflow: hidden !important;
      }
    }

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
      widgetShadowObserver?.disconnect()
      widgetShadowObserver = null
      script.remove()
      isWidgetActive = false
    }
  }, [widgetId])

  return null
}
