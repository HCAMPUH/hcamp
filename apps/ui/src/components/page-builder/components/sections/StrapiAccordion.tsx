"use client"

import type { Data } from "@repo/strapi-types"

import CkEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import Typography from "@/components/typography"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { PageBuilderComponentProps } from "@/types/general"

export default function StrapiAccordion({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.accordion">
}) {
  return (
    <section>
      <Container className="py-8">
        {component.title ? (
          <Typography tag="h2" variant="heading3" className="mb-4">
            {component.title}
          </Typography>
        ) : null}
        <Accordion type="single" collapsible>
          {component.items?.map((item) => (
            <AccordionItem key={item.id} value={item.id.toString()}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <CkEditorRenderer htmlContent={item.answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  )
}
