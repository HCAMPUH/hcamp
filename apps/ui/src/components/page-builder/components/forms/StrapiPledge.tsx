import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { PledgeContent } from "@/components/page-builder/components/forms/PledgeContent"
import { PublicStrapiClient } from "@/lib/strapi-api"
import type { PageBuilderComponentProps } from "@/types/general"

type PledgeListItem = {
  documentId: string
  firstName: string
  lastName: string
  schoolOrganization: string
}

export async function StrapiPledge({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"forms.pledge">
}) {
  const countResponse = (await PublicStrapiClient.fetchAPI(
    `${PublicStrapiClient.getStrapiApiPathByUId("api::pledge.pledge")}/count`,
    {},
    { cache: "no-store" }
  )) as { data: { count: number } }
  const listResponse = (await PublicStrapiClient.fetchAPI(
    `${PublicStrapiClient.getStrapiApiPathByUId("api::pledge.pledge")}/list`,
    { all: true },
    { cache: "no-store" }
  )) as { data: PledgeListItem[] }

  return (
    <section id="hcamp-pledge">
      <Container className="py-8">
        <PledgeContent
          title={component.title ?? ""}
          description={component.description}
          eyebrow={component.eyebrow}
          submitLabel={component.submitLabel}
          initialPledgeCount={countResponse.data.count}
          pledges={listResponse.data}
        />
      </Container>
    </section>
  )
}

StrapiPledge.displayName = "StrapiPledge"

export default StrapiPledge
