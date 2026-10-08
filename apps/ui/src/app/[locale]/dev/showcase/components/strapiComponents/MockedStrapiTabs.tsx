import type { Data } from "@repo/strapi-types"

import StrapiTabs from "@/components/page-builder/components/sections/StrapiTabs"

const data = {
  id: 1,
  __component: "sections.tabs",
  title: "Tabs",
  tabs: [
    { id: 1, label: "Tab 1", content: "<p>Content for tab 1</p>" },
    { id: 2, label: "Tab 2", content: "<p>Content for tab 2</p>" },
  ],
} as unknown as Data.Component<"sections.tabs">

export default function MockedStrapiTabs() {
  return <StrapiTabs component={data} />
}
