import "server-only"

import type { Data } from "@repo/strapi-types"
import { Clock3, MapPin, UserRound } from "lucide-react"
import Image from "next/image"

import AppLink from "@/components/elementary/AppLink"
import { Container } from "@/components/elementary/Container"
import { fetchAllPosts } from "@/lib/strapi-api/content/server"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import type { PageBuilderComponentProps } from "@/types/general"

const BRAND_COLORS = ["#024731", "#008751", "#aa0000", "#ae5e00"] as const

export async function StrapiPostList({
  component,
  pageParams,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.post-list">
}) {
  const locale = pageParams?.locale ?? "en"
  const selectedPosts = component.posts ?? []
  const posts = (
    selectedPosts.length
      ? selectedPosts
      : ((await fetchAllPosts(locale)).data ?? [])
  ).slice()

  return (
    <section>
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const imageUrl = formatStrapiMediaUrl(post.coverImage?.url)
            const accentColor =
              BRAND_COLORS[Math.abs(Number(post.id)) % BRAND_COLORS.length] ??
              BRAND_COLORS[0]

            return (
              <AppLink
                key={post.documentId}
                href={`/posts/${post.slug}`}
                variant="ghost"
                className="group text-foreground hover:text-foreground focus-visible:ring-primary/30 h-full w-full flex-col items-stretch p-0 text-left whitespace-normal no-underline hover:bg-transparent hover:no-underline"
              >
                <article className="bg-card text-card-foreground border-border flex h-full w-full flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow group-hover:shadow-md">
                  {imageUrl ? (
                    <div className="relative aspect-video">
                      <Image
                        src={imageUrl}
                        alt={post.coverImage?.alternativeText ?? post.title}
                        fill
                        className="object-cover object-top"
                        unoptimized
                      />
                      <div className="from-card via-card/45 pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t to-transparent" />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col items-start gap-4 p-6">
                    <h4 className="text-foreground w-full min-w-0 text-left text-2xl leading-tight font-semibold wrap-break-word">
                      {post.title}
                    </h4>
                    {post.excerpt ? (
                      <p className="text-muted-foreground w-full min-w-0 text-left leading-relaxed wrap-break-word">
                        {post.excerpt}
                      </p>
                    ) : null}
                    <div className="mt-auto flex w-full items-end justify-between gap-4 pt-2">
                      <div className="flex min-w-0 items-end gap-3">
                        {post.featured && post.eventDate ? (
                          <PostDate
                            date={post.eventDate}
                            locale={locale}
                            color={accentColor}
                          />
                        ) : null}
                        <div className="text-muted-foreground flex h-16 min-w-0 flex-col justify-end gap-2 text-xs leading-4">
                          {post.eventTime ? (
                            <div className="flex min-w-0 items-center gap-1.5">
                              <Clock3 className="text-primary size-3.5 shrink-0" />
                              <span className="truncate">{post.eventTime}</span>
                            </div>
                          ) : null}
                          {post.eventSpeakers ? (
                            <div className="flex min-w-0 items-center gap-1.5">
                              <UserRound className="text-primary size-3.5 shrink-0" />
                              <span className="truncate">
                                {post.eventSpeakers}
                              </span>
                            </div>
                          ) : null}
                          {post.location ? (
                            <div className="flex min-w-0 items-center gap-1.5">
                              <MapPin className="text-primary size-3.5 shrink-0" />
                              <span className="truncate">{post.location}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </AppLink>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function PostDate({
  date,
  locale,
  color,
}: {
  date: string | Date
  locale: string
  color: (typeof BRAND_COLORS)[number]
}) {
  const parsedDate = parseDate(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  })
  const month = monthFormatter.format(parsedDate).replace(".", "").toUpperCase()
  const dayFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    timeZone: "UTC",
  })
  const day = dayFormatter.format(parsedDate)

  return (
    <time
      dateTime={parsedDate.toISOString()}
      className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl leading-none text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      <span className="text-[0.65rem] font-bold tracking-[0.16em] text-white/70">
        {month}
      </span>
      <span className="mt-1 text-2xl font-bold">{day}</span>
    </time>
  )
}

function parseDate(value: string | Date) {
  return new Date(value)
}

StrapiPostList.displayName = "StrapiPostList"

export default StrapiPostList
