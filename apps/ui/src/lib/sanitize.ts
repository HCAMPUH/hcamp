export type SanitizationOptions = {
  maxLength?: number
  trim?: boolean
  preserveLineBreaks?: boolean
}

/* eslint-disable sonarjs/slow-regex, sonarjs/duplicates-in-character-class */
const CONTROL_CHAR_REGEXP = /\p{C}/gu
const HTML_TAG_REGEXP = /<\/?[^>]+>/g
const SCRIPT_TAG_REGEXP =
  /<\s*(script|iframe|object|embed|svg|math|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi
const EVENT_HANDLER_REGEXP =
  /\s+on[a-zA-Z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|[^\s>]+)/gi
/* eslint-enable sonarjs/slow-regex, sonarjs/duplicates-in-character-class */
const PROTOCOL_RELATIVE_REGEXP = /^\/\//

export function sanitizeTextInput(
  value: unknown,
  options: SanitizationOptions = {}
): string {
  if (typeof value !== "string") {
    return ""
  }

  let normalized = value.replaceAll(CONTROL_CHAR_REGEXP, "")

  if (!options.preserveLineBreaks) {
    normalized = normalized.replaceAll(/[\r\n]+/g, " ")
  }

  if (options.trim ?? true) {
    normalized = normalized.trim()
  }

  if (typeof options.maxLength === "number" && options.maxLength >= 0) {
    normalized = normalized.slice(0, options.maxLength)
  }

  return normalized
}

export function sanitizeEmailInput(value: unknown): string {
  const normalized = sanitizeTextInput(value, {
    trim: true,
    maxLength: 254,
  })

  return normalized.replaceAll(/\s+/g, "").toLowerCase()
}

export function sanitizePasswordInput(value: unknown): string {
  if (typeof value !== "string") {
    return ""
  }

  return value.replaceAll(CONTROL_CHAR_REGEXP, "")
}

export function sanitizeNameInput(value: unknown, maxLength = 120): string {
  const normalized = sanitizeTextInput(value, {
    trim: true,
    maxLength,
    preserveLineBreaks: false,
  })

  return normalized.replaceAll(/[<>]/g, "")
}

export function sanitizeMessageInput(value: unknown, maxLength = 2000): string {
  const normalized = sanitizeTextInput(value, {
    trim: true,
    maxLength,
    preserveLineBreaks: true,
  })

  return normalized.replaceAll(/[<>]/g, "")
}

export function sanitizeUrlInput(value: unknown): string {
  if (typeof value !== "string") {
    return ""
  }

  const trimmed = sanitizeTextInput(value, { trim: true, maxLength: 2048 })

  if (!trimmed) {
    return ""
  }

  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:") ||
    trimmed.startsWith("file:") ||
    PROTOCOL_RELATIVE_REGEXP.test(trimmed)
  ) {
    return ""
  }

  try {
    const url = new URL(trimmed, "http://localhost")
    if (["http:", "https:"].includes(url.protocol)) {
      return url.href
    }
  } catch {
    return ""
  }

  return ""
}

export function sanitizeHtmlInput(value: unknown): string {
  if (typeof value !== "string") {
    return ""
  }

  let normalized = sanitizeTextInput(value, {
    trim: true,
    preserveLineBreaks: true,
  })

  if (!normalized) {
    return ""
  }

  normalized = normalized
    .replaceAll(SCRIPT_TAG_REGEXP, "")
    .replaceAll(EVENT_HANDLER_REGEXP, "")
    .replaceAll(HTML_TAG_REGEXP, "")

  return normalized
}
