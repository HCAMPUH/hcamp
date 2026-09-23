import type { Locale } from "next-intl"

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
 * providers to iframes before injecting the HTML so they work in SSR, preview,
 * and the public frontend without fetching provider oEmbed APIs at render time.
 */
/* eslint-disable unicorn/no-unsafe-string-replacement, unicorn/prefer-string-replace-all */
export const transformOembedElements = (content?: string | null): string =>
  content
    ?.replace(/<oembed\b[^>]*>[\s\S]*?<\/oembed>/gi, replaceOembedElement)
    .replace(/<oembed\b[^>]*\/>/gi, replaceOembedElement) || ""
/* eslint-enable unicorn/no-unsafe-string-replacement, unicorn/prefer-string-replace-all */

function replaceOembedElement(match: string): string {
  const url = match.match(/\burl\s*=\s*(["'])(.*?)\1/i)?.[2]
  const embedUrl = url ? getEmbedUrl(url) : null

  if (!embedUrl) {
    return match
  }

  return `<iframe src="${escapeAttribute(embedUrl)}" title="Embedded media" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
}

function getEmbedUrl(value: string): string | null {
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
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`
      : null
  }

  if (vimeoHosts.has(url.hostname.toLowerCase())) {
    const videoId = url.pathname.match(/\/(?:video\/)?(\d+)/)?.[1]

    return videoId ? `https://player.vimeo.com/video/${videoId}` : null
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
