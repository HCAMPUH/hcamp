"use client"

import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import {
  Configure,
  Highlight,
  InstantSearch,
  SearchBox,
  useHits,
  useSearchBox,
} from "react-instantsearch"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getEnvVar } from "@/lib/env-vars"
import { Link } from "@/lib/navigation"

interface PageHit {
  readonly objectID: string
  readonly __position: number
  readonly title?: string
  readonly content?: unknown
  readonly slug?: string
  readonly [attribute: string]: unknown
}

function extractContentText(value: unknown): string {
  const values = [value]
  const text: string[] = []

  while (values.length > 0) {
    const current = values.pop()
    if (typeof current === "string") {
      text.push(stripHtmlTags(current))
      continue
    }
    if (Array.isArray(current)) {
      values.push(...[...current].reverse())
      continue
    }
    if (typeof current !== "object" || current === null) continue

    const content = current as {
      readonly text?: unknown
      readonly content?: unknown
      readonly children?: unknown
    }

    if (typeof content.text === "string") {
      text.push(stripHtmlTags(content.text))
    } else {
      values.push(content.content ?? content.children)
    }
  }

  return text.filter(Boolean).join(" ")
}

function stripHtmlTags(value: string): string {
  return value
    .replaceAll(/&nbsp;?/gi, " ")
    .replaceAll(/<[^>]*>/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
}

function contentFromFirstHit(content: string, query: string): string {
  const firstTerm = query.trim().split(/\s+/).find(Boolean)
  if (!firstTerm) return content

  const hitIndex = content
    .toLocaleLowerCase()
    .indexOf(firstTerm.toLocaleLowerCase())
  if (hitIndex === -1) return content

  const start = Math.max(0, hitIndex - 20)
  const sentenceEndOffset = content.slice(hitIndex).search(/[.!?](?:\s|$)/)
  const end =
    sentenceEndOffset === -1 ? content.length : hitIndex + sentenceEndOffset + 1
  const snippet = content.slice(start, end).trim()

  return `${start > 0 ? "... " : ""}${snippet || content.slice(hitIndex)}`
}

function HighlightedContent({
  content,
  query,
}: {
  readonly content: string
  readonly query: string
}) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => term.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`))

  if (terms.length === 0) return <>{content}</>

  const highlightPattern = new RegExp(`(${terms.join("|")})`, "gi")
  const termPatterns = terms.map((term) => new RegExp(`^${term}$`, "i"))
  const parts = content.split(highlightPattern)
  const firstHitIndex = parts.findIndex((part) =>
    termPatterns.some((pattern) => pattern.test(part))
  )

  return (
    <>
      {parts.map((part, index) => {
        const isHit = index === firstHitIndex

        return isHit ? (
          // eslint-disable-next-line react/no-array-index-key
          <mark key={`${part}-${index}`}>{part}</mark>
        ) : (
          part
        )
      })}
    </>
  )
}

function Hit({
  hit,
  query,
}: {
  readonly hit: PageHit
  readonly query: string
}) {
  const slug = typeof hit.slug === "string" ? hit.slug : undefined
  const href = slug ? (slug.startsWith("/") ? slug : `/${slug}`) : undefined

  if (!href) {
    return (
      <article className="border-b px-2.5 py-1.5 last:border-b-0">
        <h2 className="text-xs font-medium">
          <Highlight attribute="title" hit={hit} />
        </h2>
      </article>
    )
  }

  const content = extractContentText(hit.content)

  return (
    <Link
      href={href}
      className="hover:bg-muted block border-b px-2.5 py-1.5 last:border-b-0"
    >
      <article>
        <p className="text-sx leading-tight font-medium">
          <Highlight attribute="title" hit={hit} />
        </p>
        {content ? (
          <p className="text-sx text-muted-foreground leading-tight">
            <HighlightedContent
              content={contentFromFirstHit(content, query)}
              query={query}
            />
          </p>
        ) : null}
      </article>
    </Link>
  )
}

function SearchResults() {
  const { query } = useSearchBox()
  const { items } = useHits<PageHit>()

  if (!query.trim() || items.length === 0) return null

  return (
    <ul className="m-0 list-none p-0">
      {items.map((hit) => (
        <li
          key={String(
            hit.objectID ?? hit.slug ?? hit.title ?? JSON.stringify(hit)
          )}
          className="p-0"
        >
          <Hit hit={hit} query={query} />
        </li>
      ))}
    </ul>
  )
}

export default function NavbarSearch() {
  const t = useTranslations("general")
  const [open, setOpen] = useState(false)
  const host = getEnvVar("NEXT_PUBLIC_MEILISEARCH_HOST")
  const searchKey = getEnvVar("NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY")

  const searchClient = useMemo(
    () =>
      host && searchKey
        ? instantMeiliSearch(host, searchKey).searchClient
        : null,
    [host, searchKey]
  )

  if (!searchClient) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("search")}
          title={t("search")}
          className="rounded-full"
        >
          <Search />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="bg-background w-72 border-0 p-2 shadow-lg"
      >
        <InstantSearch indexName="page" searchClient={searchClient}>
          <Configure hitsPerPage={5} />
          <SearchBox
            autoFocus
            placeholder={t("search")}
            classNames={{
              root: "w-full",
              form: "relative",
              input:
                "h-10 w-full rounded-md border-0 bg-muted px-3 text-sm shadow-none outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:bg-muted/80 focus-visible:ring-2 focus-visible:ring-primary/20",
              submit: "hidden",
              reset: "hidden",
            }}
          />
          <SearchResults />
        </InstantSearch>
      </PopoverContent>
    </Popover>
  )
}
