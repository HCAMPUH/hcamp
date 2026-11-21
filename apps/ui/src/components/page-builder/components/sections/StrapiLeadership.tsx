"use client"

import type { Data } from "@repo/strapi-types"
import { useState } from "react"

import CKEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiLeadership({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.leadership">
}) {
  const categories = component.categories ?? []
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

  if (categories.length === 0) return null
  const activeCategory = categories[activeCategoryIndex] ?? categories[0]
  if (!activeCategory) return null

  return (
    <section>
      <Container className="py-8">
        <Tabs
          value={`category-${activeCategoryIndex}`}
          onValueChange={(value) => {
            const index = categories.findIndex(
              (_, categoryIndex) => value === `category-${categoryIndex}`
            )
            if (index !== -1) setActiveCategoryIndex(index)
          }}
          orientation="vertical"
          className="grid gap-8 md:grid-cols-[minmax(12rem,1fr)_2fr]"
        >
          <TabsList className="h-fit w-full flex-col items-stretch justify-start bg-transparent">
            {categories.map((category, index) => (
              <TabsTrigger
                key={category.id ?? index}
                value={`category-${index}`}
                id={`leadership-tab-${component.id}-${index}`}
                className="h-auto min-h-11 w-full justify-start rounded-lg px-4 py-3 text-left whitespace-normal"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category, index) => {
            const title = category.title?.trim()
            const description = category.description?.trim()
            const hasText = Boolean(title || description)
            const hasImage = Boolean(
              category.image?.media || category.image?.fallbackSrc
            )
            const textContent = hasText ? (
              <div>
                {title ? (
                  <h2 className="text-2xl font-semibold">{title}</h2>
                ) : null}
                {description ? (
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    {description}
                  </p>
                ) : null}
              </div>
            ) : null

            return (
              <TabsContent
                key={category.id ?? index}
                value={`category-${index}`}
                className="min-w-0 md:col-start-2 md:row-start-1"
              >
                {hasImage ? (
                  <div
                    className={cn(
                      "relative isolate overflow-hidden rounded-xl",
                      hasText ? "min-h-56 p-6 sm:p-8" : "aspect-[16/7]"
                    )}
                  >
                    <StrapiBasicImage
                      component={category.image}
                      fill
                      sizes="(max-width: 767px) 100vw, 66vw"
                      className="object-cover"
                    />
                    {hasText ? (
                      <div className="bg-background/60 relative z-10 w-fit max-w-full rounded-xl p-6 shadow-sm backdrop-blur-md">
                        {textContent}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  textContent
                )}
              </TabsContent>
            )
          })}
          <div
            aria-labelledby={`leadership-tab-${component.id}-${activeCategoryIndex}`}
            className="min-w-0 md:col-span-full"
            role="region"
          >
            <CKEditorRenderer
              htmlContent={activeCategory.content}
              className="pt-4"
            />
          </div>
        </Tabs>
      </Container>
    </section>
  )
}

StrapiLeadership.displayName = "StrapiLeadership"

export default StrapiLeadership
