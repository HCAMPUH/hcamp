"use client"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { PageBuilderComponentProps } from "@/types/general"

export default function StrapiTooltip({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.tooltip">
}) {
  return (
    <section>
      <Container className="flex justify-center py-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>{component.triggerLabel}</Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>{component.content}</TooltipContent>
        </Tooltip>
      </Container>
    </section>
  )
}
