import type { Data } from "@repo/strapi-types"

import StrapiPledge from "@/components/page-builder/components/forms/StrapiPledge"

const pledgeData = {
  id: 1,
  __component: "forms.pledge",
  title: "Yes, I'll take the pledge.",
  description: null,
  submitLabel: "Pledge",
} as unknown as Data.Component<"forms.pledge">

export default function MockedStrapiPledge() {
  return <StrapiPledge component={pledgeData} />
}
