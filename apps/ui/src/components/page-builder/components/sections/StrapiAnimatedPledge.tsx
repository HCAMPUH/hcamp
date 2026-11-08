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
          <div className="mb-2 flex items-center gap-4 border-b border-white/10 pb-2">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-red-900 uppercase dark:border-red-700 dark:bg-red-950/40 dark:text-red-100">
              <Award className="size-3.5" aria-hidden="true" />
              {component.titleLink ? (
                <StrapiLink
                  component={component.titleLink}
                  className="inline-flex !h-auto !min-h-0 !gap-0 !rounded-none !px-0 !py-0 text-xs !leading-none text-red-900 no-underline hover:text-red-900 dark:text-red-100 dark:hover:text-red-100"
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
