import "server-only"

import type { Data } from "@repo/strapi-types"
import { BrainCircuit } from "lucide-react"

import CkEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHcampHero({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.hcamp-hero">
}) {
  const {
    badge,
    title,
    description,
    figures,
    links,
    videoLabel,
    videoTitle,
    videoUrl,
  } = component

  return (
    <section className="bg-muted/30 overflow-hidden border-b">
      <Container className="grid min-w-0 items-center gap-10 py-10 md:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-16">
        <div className="flex w-full min-w-0 flex-col items-start">
          {badge && (
            <div className="text-brand-red bg-brand-red-soft mb-6 flex max-w-full items-center gap-2 rounded-full border border-red-300 px-4 py-2 text-sm font-semibold">
              <BrainCircuit className="size-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 wrap-break-word">{badge}</span>
            </div>
          )}

          <CkEditorRenderer
            htmlContent={title}
            className="max-w-3xl min-w-0 [&_h1]:text-5xl [&_h1]:leading-[1.05] [&_h1]:font-normal md:[&_h1]:text-6xl"
          />
          {description && (
            <CkEditorRenderer
              htmlContent={description}
              className="text-muted-foreground mt-4 max-w-3xl min-w-0"
            />
          )}

          {figures && figures.length > 0 && (
            <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
              {figures.map((figure) => (
                <HcampHeroFigure key={figure.id} component={figure} />
              ))}
            </div>
          )}

          {links && links.length > 0 && (
            <div className="mt-8 flex max-w-full min-w-0 flex-wrap gap-3">
              {links.map((link) => (
                <StrapiLink
                  key={link.id}
                  component={link}
                  className="h-auto min-h-9 max-w-full py-2 text-left break-words whitespace-normal sm:h-9 sm:py-0 sm:whitespace-nowrap"
                />
              ))}
            </div>
          )}
        </div>

        {videoUrl && (
          <HcampHeroVideo
            label={videoLabel}
            title={videoTitle}
            videoUrl={videoUrl}
          />
        )}
      </Container>
    </section>
  )
}

function HcampHeroFigure({
  component,
}: {
  readonly component: Data.Component<"shared.figure">
}) {
  const { number, prefix, suffix, description } = component

  return (
    <div className="bg-background rounded-xl border px-4 py-5 shadow-sm">
      <Typography tag="p" variant="heading3" className="text-primary font-bold">
        {prefix}
        {number}
        {suffix}
      </Typography>
      <CkEditorRenderer
        htmlContent={description}
        className="text-muted-foreground mt-1 text-sm"
      />
    </div>
  )
}

function HcampHeroVideo({
  label,
  title,
  videoUrl,
}: {
  readonly label?: string | null
  readonly title?: string | null
  readonly videoUrl: string
}) {
  return (
    <div className="border-brand-blue bg-brand-blue relative aspect-video w-full overflow-hidden rounded-2xl border-8 shadow-xl">
      <CkEditorRenderer
        htmlContent={`<figure class="media"><oembed url="${escapeHtmlAttribute(videoUrl)}"></oembed></figure>`}
        className="absolute inset-0 h-full w-full [&_.ck-content]:absolute [&_.ck-content]:inset-0 [&_.ck-content]:h-full [&_.ck-content]:w-full [&_.ck-video-placeholder]:!absolute [&_.ck-video-placeholder]:!inset-0 [&_.ck-video-placeholder]:!h-full [&_.ck-video-placeholder]:!w-full [&_.ck-video-placeholder]:rounded-none [&_.media]:!absolute [&_.media]:!inset-0 [&_.media]:!m-0 [&_.media]:!aspect-auto [&_.media]:!h-full [&_.media]:!w-full [&_.media]:!min-w-0"
      />
      {(label || title) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-4 pt-16 pb-4 text-white">
          {label && (
            <Typography
              tag="p"
              variant="small"
              className="bg-brand-red text-primary-foreground inline-flex rounded-sm px-2 py-1 font-semibold tracking-wide uppercase"
            >
              {label}
            </Typography>
          )}
          {title && (
            <Typography
              tag="p"
              variant="large"
              className="text-primary-foreground mt-1 font-semibold"
            >
              {title}
            </Typography>
          )}
        </div>
      )}
    </div>
  )
}

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

StrapiHcampHero.displayName = "StrapiHcampHero"

export default StrapiHcampHero
