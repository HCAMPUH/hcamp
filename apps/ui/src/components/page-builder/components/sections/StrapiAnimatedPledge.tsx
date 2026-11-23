import "server-only"

import type { Data } from "@repo/strapi-types"
import { Award } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { AnimatedPledgeTicker } from "@/components/page-builder/components/sections/AnimatedPledgeTicker"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { PublicStrapiClient } from "@/lib/strapi-api"
import type { PageBuilderComponentProps } from "@/types/general"

type PledgeListItem = {
  documentId: string
  firstName: string
  lastName: string
  schoolOrganization: string
}

export async function StrapiAnimatedPledge({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.animated-pledge">
}) {
  const t = await getTranslations("pledgeTicker")
  const response = (await PublicStrapiClient.fetchAPI(
    `${PublicStrapiClient.getStrapiApiPathByUId("api::pledge.pledge")}/list`,
    {
      page: 1,
      pageSize: Math.min(Math.max(component.recordsToShow ?? 30, 1), 100),
    },
    { cache: "no-store" }
  )) as { data: PledgeListItem[] }
  const pledges = response.data ?? []

  if (!pledges.length) return null

  return (
    <section aria-label={t("ariaLabel")} className="w-full py-8">
      <Container>
        <div
          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 text-white shadow-sm"
          style={{
            backgroundColor: component.backgroundColor ?? undefined,
          }}
        >
          <div className="mb-2 flex min-w-0 flex-wrap items-center gap-4 border-b border-white/10 pb-2">
            <span className="border-brand-amber-border bg-brand-amber-background text-brand-amber-foreground inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold break-words whitespace-normal uppercase">
              <Award className="size-3.5" aria-hidden="true" />
              {component.titleLink ? (
                <StrapiLink
                  component={component.titleLink}
                  className="text-brand-amber-foreground hover:text-brand-amber-foreground dark:text-brand-amber-foreground dark:hover:text-brand-amber-foreground inline-flex !h-auto !min-h-0 max-w-full min-w-0 !gap-0 !rounded-none !px-0 !py-0 text-xs !leading-tight break-words !whitespace-normal no-underline"
                >
                  {component.title}
                </StrapiLink>
              ) : (
                component.title
              )}
            </span>
            {component.description ? (
              <span className="hidden text-xs text-slate-100 sm:inline">
                {component.description}
              </span>
            ) : null}
          </div>
          <AnimatedPledgeTicker
            initialPledges={pledges}
            statusLabel={t("status")}
            ariaLabel={t("ariaLabel")}
            speed={Math.min(Math.max(component.speed ?? 35, 1), 100)}
          />
        </div>
      </Container>
    </section>
  )
}

StrapiAnimatedPledge.displayName = "StrapiAnimatedPledge"

export default StrapiAnimatedPledge
