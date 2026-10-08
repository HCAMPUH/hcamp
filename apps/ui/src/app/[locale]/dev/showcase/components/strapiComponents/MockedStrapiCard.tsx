import type { Data } from "@repo/strapi-types"

import StrapiCard from "@/components/page-builder/components/sections/StrapiCard"

const data = {
  id: 1,
  __component: "sections.card",
  title: "Card title",
  description: "Short card description",
  content: "<p>Card main content goes here.</p>",
} as unknown as Data.Component<"sections.card">

export default function MockedStrapiCard() {
  return <StrapiCard component={data} />
}
