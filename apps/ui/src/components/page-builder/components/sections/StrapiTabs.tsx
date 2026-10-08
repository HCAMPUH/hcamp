"use client"

import type { Data } from "@repo/strapi-types"

import CKEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiTabs({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.tabs">
}) {
  const tabs = component.tabs ?? []
  const firstTab = tabs[0]

  if (!firstTab) return null

  return (
    <section>
      <Container className="py-8">
        {component.title ? (
          <h2 className="mb-6 text-2xl font-semibold">{component.title}</h2>
        ) : null}
        <Tabs defaultValue="tab-0">
          <TabsList>
            {tabs.map((tab, index) => (
              <TabsTrigger key={tab.id ?? index} value={`tab-${index}`}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab, index) => (
            <TabsContent key={tab.id ?? index} value={`tab-${index}`}>
              <CKEditorRenderer htmlContent={tab.content} className="pt-4" />
            </TabsContent>
          ))}
        </Tabs>
      </Container>
    </section>
  )
}

StrapiTabs.displayName = "StrapiTabs"

export default StrapiTabs
