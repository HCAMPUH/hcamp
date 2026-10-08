import "server-only"

import type { Data } from "@repo/strapi-types"

import CKEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiCard({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.card">
}) {
  return (
    <section>
      <Container className="py-8">
        <Card>
          <CardHeader>
            <CardTitle>{component.title}</CardTitle>
            {component.description ? (
              <CardDescription>{component.description}</CardDescription>
            ) : null}
          </CardHeader>
          {component.content ? (
            <CardContent>
              <CKEditorRenderer htmlContent={component.content} />
            </CardContent>
          ) : null}
        </Card>
      </Container>
    </section>
  )
}

StrapiCard.displayName = "StrapiCard"

export default StrapiCard
