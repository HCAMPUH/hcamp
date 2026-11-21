import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiLeadership from "@/components/page-builder/components/sections/StrapiLeadership"

const data = {
  id: 1,
  __component: "sections.leadership",
  categories: [
    {
      id: 1,
      label: "Executive Leadership",
      title: "Guiding HCAMP’s statewide work",
      description:
        "Meet the leaders building concussion awareness and consistent care across Hawai‘i.",
      image: mockImage,
      content:
        "<p>Our executive team brings together experience in education, sports medicine, and community health to support athletes throughout the islands.</p>",
    },
    {
      id: 2,
      label: "Medical Advisors",
      image: mockImage,
      content:
        "<p>Advisors collaborate with schools, athletic organizations, and healthcare partners to strengthen concussion recognition, response, and recovery.</p>",
    },
  ],
} as unknown as Data.Component<"sections.leadership">

export default function MockedStrapiLeadership() {
  return <StrapiLeadership component={data} />
}
