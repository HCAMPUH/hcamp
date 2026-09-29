import { type Locale, useLocale } from "next-intl"

import {
  processLinksInHtmlContent,
  removeEmptyImagesFromContent,
  transformOembedElements,
} from "@/components/elementary/ck-editor/utils"
import { VideoLightbox } from "@/components/elementary/ck-editor/VideoLightbox"
import { cn } from "@/lib/styles"

import "@/styles/CkEditorDefaultStyles.css"

function CkEditorRenderer({
  htmlContent,
  className,
  locale: passedLocale,
  variant = "page",
}: {
  htmlContent?: string | null
  className?: string
  locale?: Locale
  variant?: "page" | "blog"
}) {
  // The locale hook must run before the content guard to preserve hook order.
  // eslint-disable-next-line unicorn/no-declarations-before-early-exit
  const currentLocale = useLocale()

  if (!htmlContent) return null

  const locale = passedLocale ?? currentLocale
  const processHtmlContent = (html: string, locale: Locale) => {
    const transformers = [
      (h: string) => processLinksInHtmlContent(h, locale),
      removeEmptyImagesFromContent,
      transformOembedElements,
    ]

    return transformers.reduce((result, transform) => transform(result), html)
  }

  return (
    <VideoLightbox>
      <div
        className={cn(
          "ck-content",
          `ck-editor-rich-text-${variant}`,
          className
        )}
        dangerouslySetInnerHTML={{
          __html: processHtmlContent(htmlContent, locale),
        }}
      />
    </VideoLightbox>
  )
}

export default CkEditorRenderer
