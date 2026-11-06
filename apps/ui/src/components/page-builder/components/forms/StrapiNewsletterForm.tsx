import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { NewsletterForm } from "@/components/elementary/forms/NewsletterForm"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiNewsletterForm({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"forms.newsletter-form">
}) {
  return (
    <section id="hcamp-newsletter">
      <Container className="py-8">
        <div className="border-border bg-muted/30 text-foreground overflow-hidden rounded-2xl border">
          <div className="grid lg:grid-cols-[1.05fr_1.4fr]">
            <div className="flex min-h-72 flex-col justify-center p-7 sm:p-10 lg:min-h-96">
              <div className="max-w-md">
                <Typography
                  tag="h2"
                  variant="heading2"
                  fontWeight="extraBold"
                  className="!text-3xl leading-tight sm:!text-4xl"
                >
                  {component.title}
                </Typography>
                {component.description ? (
                  <Typography
                    variant="medium"
                    className="text-muted-foreground mt-3 text-sm"
                  >
                    {component.description}
                  </Typography>
                ) : null}
              </div>
            </div>

            <div className="border-border border-t p-7 sm:p-10 lg:border-t-0 lg:border-l">
              <NewsletterForm />
              {component.gdpr &&
              (component.gdpr.href ||
                component.gdpr.page?.fullPath ||
                component.gdpr.post?.slug) ? (
                <StrapiLink
                  component={component.gdpr}
                  className="text-muted-foreground hover:text-foreground mt-5 inline-flex text-xs underline underline-offset-2"
                />
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

StrapiNewsletterForm.displayName = "StrapiNewsletterForm"

export default StrapiNewsletterForm
