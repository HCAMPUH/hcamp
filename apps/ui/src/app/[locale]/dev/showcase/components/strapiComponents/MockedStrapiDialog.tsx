import type { Data } from "@repo/strapi-types"

import StrapiDialog from "@/components/page-builder/components/sections/StrapiDialog"

const data = {
  id: 1,
  __component: "sections.dialog",
  triggerLabel: "Open dialog",
  title: "Dialog title",
  description: "This is a demo dialog from the design system.",
  content: "<p>Dialog body content goes here.</p>",
} as unknown as Data.Component<"sections.dialog">

export default function MockedStrapiDialog() {
  return <StrapiDialog component={data} />
}
