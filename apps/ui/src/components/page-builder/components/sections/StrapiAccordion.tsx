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
          <Typography tag="h2" variant="heading3" className="mb-4 text-center">
            {component.title}
          </Typography>
        ) : null}
        <Accordion type="single" collapsible>
          {component.items?.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id.toString()}
              className={
                item.questionBackgroundColor ? "border-b-0" : undefined
              }
            >
              <AccordionTrigger
                className={
                  item.questionBackgroundColor
                    ? "border border-b-0 px-4 data-[state=open]:rounded-b-none"
                    : "px-4"
                }
                style={{
                  backgroundColor: item.questionBackgroundColor ?? undefined,
                }}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent
                className={
                  item.questionBackgroundColor
                    ? "-mt-px rounded-b-md border"
                    : undefined
                }
                contentClassName={
                  item.questionBackgroundColor ? "px-4" : undefined
                }
              >
                <CkEditorRenderer htmlContent={item.answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  )
}
