import type { Locale } from "next-intl"
import { HTMLElement, parse } from "node-html-parser"

import { routing } from "@/lib/navigation"

/**
 * Function to remove empty images (images without src) from HTML content.
 */
export const removeEmptyImagesFromContent = (content?: string | null): string =>
  content?.replaceAll(
    // eslint-disable-next-line sonarjs/empty-string-repetition
    /<img\b[^>]*\bsrc\s*=\s*(['"])(?:\s*|\?(?:[^'" >]*)?)\1[^>]*>/gi,
    ""
  ) || ""

const youtubeHosts = new Set([
  "www.youtube.com",
  "youtube.com",
  "m.youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "youtu.be",
])

const vimeoHosts = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"])

/**
 * CKEditor stores media embeds as `<oembed>` elements. Convert supported
 * providers to clickable placeholders before injecting the HTML. Vimeo
 * thumbnails are resolved by the server route when the image is requested,
 * avoiding a provider API call during rendering.
 */
/* eslint-disable unicorn/no-unsafe-string-replacement, unicorn/prefer-string-replace-all */
export const transformOembedElements = (content?: string | null): string =>
  content
    ?.replace(/<oembed\b[^>]*>[\s\S]*?<\/oembed>/gi, replaceOembedElement)
    .replace(/<oembed\b[^>]*\/>/gi, replaceOembedElement) || ""
/* eslint-enable unicorn/no-unsafe-string-replacement, unicorn/prefer-string-replace-all */

/**
 * Converts CKEditor layout tables into responsive Bootstrap-style rows and
 * columns for the published page. Layout tables are only an authoring format;
 * table cells must not constrain the content flow in the frontend.
 */
export const transformLayoutTables = (content?: string | null): string => {
  if (!content?.includes("layout-table")) {
    return content || ""
  }

  const root = parse(content)

  const layoutTables = root.querySelectorAll(
    ":scope figure.table.layout-table, :scope table.table.layout-table"
  )

  // Convert inner layout tables first so their transformed markup is included
  // when the containing layout table's cell content is read.
  for (const table of [...layoutTables].reverse()) {
    const rows = table.querySelectorAll(
      ":scope > table > tbody > tr, :scope > table > thead > tr, :scope > table > tfoot > tr, :scope > tbody > tr, :scope > thead > tr, :scope > tfoot > tr, :scope > tr"
    )

    if (rows.length === 0) {
      continue
    }

    const columnWidths = table
      .querySelectorAll(":scope colgroup > col")
      .map((column) => {
        const width =
          column
            .getAttribute("style")
            ?.match(/(?:^|;)\s*width\s*:\s*([^;]+)/i)?.[1] ||
          column.getAttribute("width")

        return width?.trim().match(/^(?:\d+(?:\.\d+)?%|\d+(?:\.\d+)?px)$/)
          ? width.trim()
          : undefined
      })

    const grid = rows
      .map((row) => {
        const cells = row.childNodes.filter(
          (node): node is HTMLElement =>
            node instanceof HTMLElement &&
            ["TD", "TH"].includes(node.rawTagName.toUpperCase())
        )

        if (cells.length === 0) {
          return ""
        }

        return `<div class="row">${cells
          .map((cell, index) => {
            const width =
              columnWidths[index] ||
              cell
                .getAttribute("style")
                ?.match(/(?:^|;)\s*width\s*:\s*([^;]+)/i)?.[1]
            const safeWidth = width
              ?.trim()
              .match(/^(?:\d+(?:\.\d+)?%|\d+(?:\.\d+)?px)$/)?.[0]
            const widthStyle = safeWidth
              ? ` style="--ck-layout-column-width:${safeWidth}"`
              : ""

            return `<div class="col-12 col-md"${widthStyle}>${cell.innerHTML}</div>`
          })
          .join("")}</div>`
      })
      .join("")

    table.replaceWith(`<div class="ck-layout-grid">${grid}</div>`)
  }

  return root.toString()
}

function replaceOembedElement(match: string): string {
  const url = match.match(/\burl\s*=\s*(["'])(.*?)\1/i)?.[2]
  const video = url ? getVideoDetails(url) : null

  if (!video) {
    return match
  }

  return `<button type="button" class="ck-video-placeholder" data-video-embed="${escapeAttribute(video.embedUrl)}" aria-label="Play ${video.provider} video"><img src="${escapeAttribute(video.thumbnailUrl)}" alt="" loading="lazy" /><span class="ck-video-placeholder__play" aria-hidden="true"><span></span></span></button>`
}

function getVideoDetails(value: string): null | {
  embedUrl: string
  thumbnailUrl: string
  provider: "YouTube" | "Vimeo"
} {
  let url: URL

  try {
    url = new URL(value)
  } catch {
    return null
  }

  if (url.protocol !== "https:") {
    return null
  }

  if (youtubeHosts.has(url.hostname.toLowerCase())) {
    const videoId =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : url.searchParams.get("v") ||
          url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1]

    return videoId
      ? {
          embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`,
          thumbnailUrl: `/api/youtube-thumbnail?video=${encodeURIComponent(videoId)}`,
          provider: "YouTube",
        }
      : null
  }

  if (vimeoHosts.has(url.hostname.toLowerCase())) {
    const videoId = url.pathname.match(/\/(?:video\/)?(\d+)/)?.[1]

    return videoId
      ? {
          embedUrl: `https://player.vimeo.com/video/${videoId}`,
          thumbnailUrl: `/api/vimeo-thumbnail?video=${videoId}`,
          provider: "Vimeo",
        }
      : null
  }

  return null
}

const escapeAttribute = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")

/**
 * Function to process links in HTML content, adding locale prefix to internal links.
 */
export const processLinksInHtmlContent = (html: string, locale: Locale) =>
  html?.replaceAll(
    /<a\b([^>]*?)\bhref=(["'])(\/[^"']*)\2([^>]*)>/gi,
    (match, beforeAttrs, quote, href, afterAttrs) => {
      const newHref = processLinkHrefAttribute(href, locale)

      return `<a${beforeAttrs}href=${quote}${newHref}${quote}${afterAttrs}>`
    }
  )

const processLinkHrefAttribute = (href: string, locale: Locale) =>
  hrefIncludesLocale(href)
    ? href
    : `/${locale}${href.startsWith("/") ? "" : "/"}${href}`

const hrefIncludesLocaleRegExp = new RegExp(`^/(${routing.locales.join("|")})`)

const hrefIncludesLocale = (href: string) => hrefIncludesLocaleRegExp.test(href)
