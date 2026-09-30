import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { ErrorBoundary } from "@/components/elementary/ErrorBoundary"
import { PageContentComponents } from "@/components/page-builder"
import { logger } from "@/lib/logging"
import { fetchPost } from "@/lib/strapi-api/content/server"

export const dynamic = "force-static"
export const dynamicParams = true
export const revalidate = 300

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = (await fetchPost(slug, locale as Locale)).data

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale as Locale)

  const post = (await fetchPost(slug, locale as Locale)).data
  if (!post) {
    notFound()
  }

  return (
    <main className="flex w-full flex-col overflow-hidden">
      <Container className="py-12 md:py-20">
        <article>
          <h1 className="text-4xl font-bold md:text-6xl">{post.title}</h1>
          {post.excerpt ? (
            <p className="text-muted-foreground mt-6 max-w-3xl text-xl">
              {post.excerpt}
            </p>
          ) : null}
          <div className="mt-12">
            {post.content
              ?.filter((component) => component != null)
              .map((component) => {
                const Component = PageContentComponents[component.__component]

                if (!Component) {
                  logger.warn("Unknown post content component", {
                    name: component.__component,
                    id: component.id,
                  })

                  return null
                }

                const key = `${component.__component}-${component.id}`

                return (
                  <ErrorBoundary key={key}>
                    <Component
                      component={component}
                      pageParams={{ locale: locale as Locale }}
                    />
                  </ErrorBoundary>
                )
              })}
          </div>
        </article>
      </Container>
    </main>
  )
}
