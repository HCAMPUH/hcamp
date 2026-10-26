import "server-only"

import type { Data } from "@repo/strapi-types"
import { ChevronRight } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import type { PageBuilderComponentProps } from "@/types/general"

type AboutResource = NonNullable<
  Data.Component<"sections.about">["resources"]
>[number]

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim())
}

export function StrapiAbout({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.about">
}) {
  const partners = component.partners?.filter((partner) => partner.name) ?? []
  const resources =
    component.resources?.filter(
      (resource) => resource.title || resource.description
    ) ?? []
  const hasInstitutionLogo = Boolean(
    component.institutionLogo?.media || component.institutionLogo?.fallbackSrc
  )
  const hasResources = resources.length > 0
  const hasInstitutionContent = Boolean(
    component.institutionEyebrow ||
    hasInstitutionLogo ||
    component.institutionDescription ||
    partners.length
  )
  if (
    !component.eyebrow &&
    !component.title &&
    !component.description &&
    !hasResources &&
    !hasInstitutionContent
  ) {
    return null
  }

  const showPartnerSeparator = Boolean(
    hasText(component.institutionEyebrow) ||
    hasText(component.institutionDescription)
  )

  return (
    <section
      id="hcamp-about"
      className="bg-background relative overflow-hidden py-20 text-white"
      style={
        component.backgroundColor
          ? { backgroundColor: component.backgroundColor }
          : undefined
      }
    >
      <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-12">
        <div
          className={
            hasInstitutionContent
              ? "space-y-8 lg:col-span-7"
              : "space-y-8 lg:col-span-12"
          }
        >
          <div>
            {component.eyebrow ? (
              <p className="inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-bold tracking-widest text-amber-400 uppercase">
                {component.eyebrow}
              </p>
            ) : null}
            {component.title ? (
              <h2 className="mt-3 mb-4 text-3xl font-extrabold sm:text-4xl">
                {component.title}
              </h2>
            ) : null}
            {component.description ? (
              <p className="text-base leading-relaxed text-slate-300">
                {component.description}
              </p>
            ) : null}
          </div>

          {hasResources ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.id ?? resource.title}
                  resource={resource}
                />
              ))}
            </div>
          ) : null}
        </div>

        {hasInstitutionContent ? (
          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md lg:col-span-5">
            {component.institutionEyebrow ? (
              <p className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase">
                {component.institutionEyebrow}
              </p>
            ) : null}
            {hasInstitutionLogo ? (
              <InstitutionLogoMedia component={component.institutionLogo} />
            ) : null}
            {component.institutionDescription ? (
              <p className="text-xs leading-relaxed text-slate-300">
                {component.institutionDescription}
              </p>
            ) : null}

            {partners.length ? (
              <div
                className={
                  showPartnerSeparator
                    ? "border-t border-white/10 pt-6"
                    : undefined
                }
              >
                {component.partnersEyebrow ? (
                  <p className="text-brand-gold mb-3 text-center text-xs font-bold tracking-wider uppercase">
                    {component.partnersEyebrow}
                  </p>
                ) : null}
                <div
                  className={
                    partners.length === 2
                      ? "mx-auto mt-3 grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2"
                      : "mt-3 grid gap-2 sm:grid-cols-3"
                  }
                >
                  {partners.map((partner) =>
                    partner.link ? (
                      <StrapiLink
                        key={partner.id ?? partner.name}
                        component={partner.link}
                        className="h-auto min-h-8 rounded-lg bg-white/10 p-2 text-center text-[11px] font-semibold text-slate-300 no-underline hover:bg-white/20 hover:no-underline focus-visible:ring-2 focus-visible:ring-amber-400"
                      >
                        {partner.name}
                      </StrapiLink>
                    ) : (
                      <span
                        key={partner.id ?? partner.name}
                        className="flex min-h-8 items-center justify-center rounded-lg bg-white/10 p-2 text-center text-[11px] font-semibold text-slate-300 hover:bg-white/20"
                      >
                        {partner.name}
                      </span>
                    )
                  )}
                </div>
              </div>
            ) : null}
          </aside>
        ) : null}
      </Container>
    </section>
  )
}

function InstitutionLogoMedia({
  component,
}: {
  component: Data.Component<"sections.about">["institutionLogo"]
}) {
  return (
    <div className="bg-background relative z-10 flex min-h-26 items-center justify-center rounded-2xl p-6 shadow-inner">
      <StrapiBasicImage
        component={component}
        width={320}
        height={100}
        className="max-h-20 w-auto object-contain brightness-0 dark:brightness-0 dark:invert"
      />
    </div>
  )
}

function ResourceCard({ resource }: { resource: AboutResource }) {
  if (!resource.title && !resource.description) {
    return null
  }

  const content = (
    <>
      <div className="min-w-0">
        {resource.title ? (
          <div className="mb-1 text-sm leading-tight font-bold text-amber-400">
            {resource.title}
          </div>
        ) : null}
        {resource.description ? (
          <p className="text-xs leading-relaxed text-slate-400">
            {resource.description}
          </p>
        ) : null}
      </div>
      {resource.link ? (
        <ChevronRight
          className="text-brand-gold size-4 shrink-0 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      ) : null}
    </>
  )

  return resource.link ? (
    <StrapiLink
      component={resource.link}
      className="group h-auto min-h-20 items-start justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-left whitespace-normal transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      {content}
    </StrapiLink>
  ) : (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
      {content}
    </div>
  )
}

StrapiAbout.displayName = "StrapiAbout"

export default StrapiAbout
