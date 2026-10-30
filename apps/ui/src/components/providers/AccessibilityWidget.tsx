"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

const accessibilityWidgetBaseUrl =
  "https://www.skynettechnologies.com/accessibility/js/all-in-one-accessibility-js-widget-minify.js"
const accessibilitySettingsUrl =
  "https://ada.skynettechnologies.us/api/widget-settings"

type AccessibilitySettings = {
  readonly widget_color_code?: string
  readonly widget_position?: string
  readonly widget_icon_type?: string
  readonly widget_icon_size?: string
}

const defaultAccessibilitySettings: Required<AccessibilitySettings> = {
  widget_color_code: "#420083",
  widget_position: "bottom_right",
  widget_icon_type: "aioa-icon-type-1",
  widget_icon_size: "aioa-default-icon",
}

function createAccessibilityWidgetScript(
  settings: Required<AccessibilitySettings>
) {
  const params = new URLSearchParams({
    colorcode: settings.widget_color_code.replace(/^#/, ""),
    token: "null",
    t: String(Date.now()),
    position: `${settings.widget_position}.${settings.widget_icon_type}.${settings.widget_icon_size}`,
  })

  return `${accessibilityWidgetBaseUrl}?${params.toString()}`
}

function isAccessibilitySettings(
  value: unknown
): value is AccessibilitySettings {
  return typeof value === "object" && value !== null
}

function settingOrDefault(value: unknown, fallback: string) {
  if (typeof value !== "string" || !value) return fallback

  return value
}

function createSettingsFormData(hostname: string) {
  const formData = new FormData()
  formData.append("website_url", hostname)

  return formData
}

export function AccessibilityWidgetScript() {
  const [scriptUrl, setScriptUrl] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadSettings = async () => {
      try {
        const response = await fetch(accessibilitySettingsUrl, {
          method: "POST",
          body: createSettingsFormData(window.location.hostname),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(
            `Accessibility settings request failed: ${response.status}`
          )
        }

        const responseData: unknown = await response.json()
        const responseObject: { readonly Data?: unknown } = {}
        if (isAccessibilitySettings(responseData)) {
          Object.assign(responseObject, responseData)
        }
        const data = isAccessibilitySettings(responseObject.Data)
          ? (responseObject.Data as Record<string, unknown>)
          : {}
        const settings = {
          widget_color_code: settingOrDefault(
            data.widget_color_code,
            defaultAccessibilitySettings.widget_color_code
          ),
          widget_position: settingOrDefault(
            data.widget_position,
            defaultAccessibilitySettings.widget_position
          ),
          widget_icon_type: settingOrDefault(
            data.widget_icon_type,
            defaultAccessibilitySettings.widget_icon_type
          ),
          widget_icon_size: settingOrDefault(
            data.widget_icon_size,
            defaultAccessibilitySettings.widget_icon_size
          ),
        } as Required<AccessibilitySettings>

        const nextScriptUrl = createAccessibilityWidgetScript(settings)
        setScriptUrl(nextScriptUrl)
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }

        console.error(
          "Failed to load accessibility settings; using defaults",
          error
        )
        setScriptUrl(
          createAccessibilityWidgetScript(defaultAccessibilitySettings)
        )
      }
    }

    void loadSettings()

    return () => controller.abort()
  }, [])

  if (!scriptUrl) return null

  return (
    <Script
      id="aioa-adawidget"
      src={scriptUrl}
      strategy="afterInteractive"
      onError={(event) => {
        console.error("Failed to load accessibility widget script", event)
      }}
    />
  )
}
