import "server-only"

import type { Data } from "@repo/strapi-types"
import { Scale } from "lucide-react"

import CkEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiLawRequirements({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.law-requirements">
}) {
  const { badge, title, description, requirements, links } = component

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl bg-red-900 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 hidden h-[58%] w-[48%] justify-end overflow-hidden lg:flex"
          >
            <Scale
              className="-mt-12 size-[360px] translate-x-1 text-white/10"
              strokeWidth={1}
            />
          </div>

          <div className="relative z-10 max-w-5xl">
            {badge ? (
              <Typography
                tag="p"
                variant="small"
                fontWeight="semiBold"
                className="border-brand-amber-border bg-brand-amber-background text-brand-amber-foreground relative -mt-10 mb-0 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
              >
                <Scale className="size-3.5" aria-hidden="true" />
                {badge}
              </Typography>
            ) : null}

            <CkEditorRenderer
              htmlContent={title}
              className="mt-12 [&_h1]:!text-5xl [&_h1]:leading-[1.05] [&_h1]:font-extrabold [&_h1]:!text-white [&_h2]:!text-5xl [&_h2]:leading-[1.05] [&_h2]:font-extrabold [&_h2]:!text-white [&_h3]:!text-5xl [&_h3]:leading-[1.05] [&_h3]:font-extrabold [&_h3]:!text-white [&_p]:!text-5xl [&_p]:leading-[1.05] [&_p]:font-extrabold [&_p]:!text-white [&_span]:!text-white [&_strong]:!text-white"
            />

            {description ? (
              <CkEditorRenderer
                htmlContent={description}
                className="mt-5 max-w-3xl text-xl leading-relaxed text-white [&_p]:!text-white [&_span]:!text-white [&_strong]:!text-white"
              />
            ) : null}

            {requirements && requirements.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {requirements.map((requirement, index) => (
                  <article
                    key={requirement.id}
                    className="min-h-36 rounded-2xl border border-white/15 bg-white/12 px-5 py-4"
                  >
                    <div className="text-brand-amber-border flex items-baseline text-base leading-tight font-semibold">
                      <span className="shrink-0 whitespace-nowrap">
                        {index + 1}.&nbsp;
                      </span>
                      <CkEditorRenderer
                        htmlContent={requirement.title}
                        className="[&_p]:!text-brand-amber-border [&_span]:!text-brand-amber-border [&_strong]:!text-brand-amber-border min-w-0 [&_.ck-content]:inline [&_.ck-content]:leading-tight [&_p]:m-0 [&_p]:inline [&_p]:leading-tight"
                      />
                    </div>
                    {requirement.description ? (
                      <CkEditorRenderer
                        htmlContent={requirement.description}
                        className="mt-2 text-sm leading-snug text-white/90 sm:text-base [&_p]:!text-white [&_span]:!text-white [&_strong]:!text-white"
                      />
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}

            {links && links.length > 0 ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {links.map((link, index) => (
                  <StrapiLink
                    key={link.id}
                    component={link}
                    className={
                      index === 0
                        ? "border-brand-amber-border bg-brand-amber-border !text-brand-red hover:border-brand-gold-soft hover:bg-brand-gold-soft hover:!text-brand-red focus-visible:ring-brand-gold-soft h-auto min-h-11 rounded-lg border px-5 py-3 transition-colors duration-200 focus-visible:ring-2"
                        : "hover:border-brand-amber-border focus-visible:ring-brand-amber-border h-auto min-h-11 rounded-lg border border-white/25 bg-transparent px-5 py-3 !text-white transition-colors duration-200 hover:bg-white/10 focus-visible:ring-2"
                    }
                  >
                    <span
                      className={index === 0 ? "!text-black" : "!text-white"}
                    >
                      {link.label}
                    </span>
                  </StrapiLink>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}

StrapiLawRequirements.displayName = "StrapiLawRequirements"

export default StrapiLawRequirements
