import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiAnimatedLogoRow from "@/components/page-builder/components/sections/StrapiAnimatedLogoRow"

const data = {
  id: 1,
  __component: "sections.animated-logo-row",
  title: "<h3>Our partners</h3>",
  logos: [
    { ...mockImage, id: 1 },
    { ...mockImage, id: 2 },
    { ...mockImage, id: 3 },
    { ...mockImage, id: 4 },
  ],
} as unknown as Data.Component<"sections.animated-logo-row">

export default function MockedStrapiAnimatedLogoRow() {
  return <StrapiAnimatedLogoRow component={data} />
}
