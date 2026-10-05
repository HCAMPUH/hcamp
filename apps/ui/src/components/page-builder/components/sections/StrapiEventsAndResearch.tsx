import "server-only"

import type { Data } from "@repo/strapi-types"
import { Clock3, ExternalLink, MapPin, UserRound } from "lucide-react"

import AppLink from "@/components/elementary/AppLink"
import { Container } from "@/components/elementary/Container"
import { StrapiLink } from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

type Event = NonNullable<
  Data.Component<"sections.events-and-research">["events"]
>[number]
type ResearchItem = NonNullable<
  Data.Component<"sections.events-and-research">["researchItems"]
>[number]

const BRAND_COLORS = ["#024731", "#008751", "#aa0000", "#ae5e00"] as const
const CARD_TITLE_CLASS = "!text-base leading-tight"

export function StrapiEventsAndResearch({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.events-and-research">
}) {
  return (
    <section>
      <Container className="grid gap-12 py-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <SectionIntro
            eyebrow={component.eventsEyebrow}
            title={component.eventsTitle}
            description={component.eventsDescription}
          />
          <div className="mt-8 flex flex-col gap-4">
            {component.events?.map((event) => (
              <EventCard key={event.documentId ?? event.id} event={event} />
            ))}
          </div>
          {component.eventHighlightTitle ? (
            <div className="bg-foreground text-background mt-8 rounded-2xl p-6">
              {component.eventHighlightLabel ? (
                <Typography
                  variant="small"
                  fontWeight="semiBold"
                  className="text-amber-400"
                >
                  {component.eventHighlightLabel}
                </Typography>
              ) : null}
              <Typography
                tag="h3"
                variant="heading4"
                fontWeight="semiBold"
                className="text-background mt-4"
              >
                {component.eventHighlightTitle}
              </Typography>
              {component.eventHighlightDescription ? (
                <Typography variant="small" className="text-background/70 mt-3">
                  {component.eventHighlightDescription}
                </Typography>
              ) : null}
            </div>
          ) : null}
        </div>

        <div>
          <SectionIntro
            eyebrow={component.researchEyebrow}
            title={component.researchTitle}
            description={component.researchDescription}
          />
          <div className="mt-8 flex flex-col gap-4">
            {component.researchItems?.map((item) => (
              <ResearchCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string | null | undefined
  title: string | null | undefined
  description?: string | null
}) {
  return (
    <header>
      <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-red-800 uppercase">
        {eyebrow}
      </span>
      <Typography
        tag="h2"
        variant="heading2"
        fontWeight="extraBold"
        className="mt-3 !text-3xl leading-tight"
      >
        {title}
      </Typography>
      {description ? (
        <Typography
          variant="medium"
          className="text-muted-foreground mt-2 max-w-2xl"
        >
          {description}
        </Typography>
      ) : null}
    </header>
  )
}

function EventCard({ event }: { event: Event }) {
  const parsedDate = event.eventDate ? new Date(event.eventDate) : null
  const hasValidDate = parsedDate && !Number.isNaN(parsedDate.getTime())
  const accentColor =
    BRAND_COLORS[Math.abs(Number(event.id)) % BRAND_COLORS.length] ??
    BRAND_COLORS[0]

  return (
    <AppLink
      href={`/posts/${event.slug}`}
      variant="ghost"
      className="group border-border bg-muted/30 hover:bg-muted/50 h-auto items-stretch justify-start gap-4 rounded-2xl border p-5 text-left whitespace-normal no-underline hover:no-underline"
    >
      {hasValidDate ? (
        <time
          dateTime={parsedDate.toISOString()}
          className="text-primary-foreground flex size-16 shrink-0 flex-col items-center justify-center rounded-xl"
          style={{ backgroundColor: accentColor }}
        >
          <span className="text-[0.65rem] font-bold tracking-[0.16em] uppercase opacity-75">
            {parsedDate.toLocaleDateString("en-US", {
              month: "short",
              timeZone: "UTC",
            })}
          </span>
          <span className="mt-1 text-2xl font-bold">
            {parsedDate.toLocaleDateString("en-US", {
              day: "2-digit",
              timeZone: "UTC",
            })}
          </span>
        </time>
      ) : null}
      <div className="min-w-0">
        <Typography
          tag="h3"
          variant="medium"
          fontWeight="semiBold"
          className={CARD_TITLE_CLASS}
        >
          {event.title}
        </Typography>
        <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {event.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden="true" />
              {event.location}
            </span>
          ) : null}
          {event.eventTime ? (
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" aria-hidden="true" />
              {event.eventTime}
            </span>
          ) : null}
          {event.eventSpeakers ? (
            <span className="inline-flex items-center gap-1">
              <UserRound className="size-3.5" aria-hidden="true" />
              {event.eventSpeakers}
            </span>
          ) : null}
        </div>
      </div>
    </AppLink>
  )
}

function ResearchCard({ item }: { item: ResearchItem }) {
  const href =
    item.link?.type === "page" ? item.page?.fullPath : item.link?.href

  return (
    <article className="border-border bg-muted/30 rounded-2xl border p-5">
      <div className="flex items-start justify-between gap-4">
        <Typography
          variant="small"
          fontWeight="semiBold"
          className="text-muted-foreground uppercase"
        >
          {item.journal} • {item.year}
        </Typography>
        <span className="shrink-0 rounded border border-red-200 bg-red-50 px-2 py-1 text-[0.65rem] font-semibold text-red-800 uppercase">
          Peer reviewed
        </span>
      </div>
      <Typography
        tag="h3"
        variant="medium"
        fontWeight="semiBold"
        className={`${CARD_TITLE_CLASS} mt-4`}
      >
        {item.title}
      </Typography>
      <Typography variant="small" className="text-muted-foreground mt-2">
        {item.description}
      </Typography>
      {href ? (
        item.link ? (
          <StrapiLink
            component={item.link}
            className="mt-4 inline-flex p-0 font-semibold text-red-800 hover:bg-transparent hover:text-red-900"
          >
            {item.link.label}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </StrapiLink>
        ) : (
          <AppLink
            href={href}
            variant="link"
            className="mt-4 h-auto p-0 font-semibold text-red-800 hover:text-red-900"
          >
            Read more
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </AppLink>
        )
      ) : null}
    </article>
  )
}

StrapiEventsAndResearch.displayName = "StrapiEventsAndResearch"

export default StrapiEventsAndResearch
