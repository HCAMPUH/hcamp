import type { Data } from "@repo/strapi-types"

import StrapiLawRequirements from "@/components/page-builder/components/sections/StrapiLawRequirements"

const data = {
  id: 1,
  __component: "sections.law-requirements",
  badge: "State Legislation & Safety Mandates",
  title: "<h2>Hawaii Concussion Law Requirements</h2>",
  description:
    "<p>Under Hawaii Law (Act 197 / Act 262), annual concussion education is mandatory for public and private school athletic staff, coaches, student-athletes, and parents. The law defines mandatory removal from play, immediate evaluation, and strict Return-to-Learn &amp; Return-to-Play protocols before returning to athletic competition.</p>",
  requirements: [
    {
      id: 1,
      title: "<p>Annual Education</p>",
      description:
        "<p>Mandatory training for coaches, parents, and student-athletes every school year.</p>",
    },
    {
      id: 2,
      title: "<p>Immediate Removal</p>",
      description:
        "<p>Any athlete showing suspected signs must be removed from play immediately.</p>",
    },
    {
      id: 3,
      title: "<p>Graduated Return</p>",
      description:
        "<p>Stepwise Return-to-Learn and Return-to-Play protocols supervised by medical teams.</p>",
    },
  ],
  links: [
    {
      id: 1,
      type: "external",
      label: "Read Full Statute Details",
      href: "https://www.capitol.hawaii.gov/",
      newTab: true,
      decorations: {
        variant: "default",
      },
    },
    {
      id: 2,
      type: "external",
      label: "Law Overview One-Pager",
      href: "https://www.capitol.hawaii.gov/",
      newTab: true,
      decorations: {
        variant: "outline",
      },
    },
  ],
} as unknown as Data.Component<"sections.law-requirements">

export default function MockedStrapiLawRequirements() {
  return <StrapiLawRequirements component={data} />
}
