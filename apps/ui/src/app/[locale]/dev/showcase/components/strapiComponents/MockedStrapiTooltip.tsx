import type { Data } from "@repo/strapi-types"

import StrapiTooltip from "@/components/page-builder/components/sections/StrapiTooltip"

const data = {
  id: 1,
  __component: "sections.tooltip",
  triggerLabel: "Hover me",
  content: "This is a tooltip",
} as unknown as Data.Component<"sections.tooltip">

export default function MockedStrapiTooltip() {
  return <StrapiTooltip component={data} />
}
