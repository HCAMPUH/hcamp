"use client"

import type { Data } from "@repo/strapi-types"

import CKEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { PageBuilderComponentProps } from "@/types/general"

export default function StrapiDialog({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.dialog">
}) {
  return (
    <section>
      <Container className="flex justify-center py-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button>{component.triggerLabel}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{component.title}</DialogTitle>
              {component.description ? (
                <DialogDescription>{component.description}</DialogDescription>
              ) : null}
            </DialogHeader>
            {component.content ? (
              <CKEditorRenderer htmlContent={component.content} />
            ) : null}
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      </Container>
    </section>
  )
}
