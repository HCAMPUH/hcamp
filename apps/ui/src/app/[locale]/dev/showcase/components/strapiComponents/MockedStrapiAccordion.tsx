import type { Data } from "@repo/strapi-types"

import StrapiAccordion from "@/components/page-builder/components/sections/StrapiAccordion"

const data = {
  id: 1,
  __component: "sections.accordion",
  title: "Frequently asked questions",
  items: [
    { id: 1, question: "Question one", answer: "Answer one" },
    { id: 2, question: "Question two", answer: "Answer two" },
  ],
} as unknown as Data.Component<"sections.accordion">

export default function MockedStrapiAccordion() {
  return <StrapiAccordion component={data} />
}
