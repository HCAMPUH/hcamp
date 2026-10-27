import type { Data } from "@repo/strapi-types"

import StrapiAnimatedPledge from "@/components/page-builder/components/sections/StrapiAnimatedPledge"

const data = {
  id: 1,
  __component: "sections.animated-pledge",
  title: '"Pledge To Report" Wall of Honor',
  titleLink: null,
  description:
    "Student-athletes across Hawaii promising honesty in concussion reporting.",
} as unknown as Data.Component<"sections.animated-pledge">

export default function MockedStrapiAnimatedPledge() {
  return <StrapiAnimatedPledge component={data} />
}
