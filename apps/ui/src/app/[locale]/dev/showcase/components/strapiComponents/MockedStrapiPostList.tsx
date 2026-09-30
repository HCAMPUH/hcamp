import type { Data } from "@repo/strapi-types"

import { StrapiPostList } from "@/components/page-builder/components/sections/StrapiPostList"

const data = {
  id: 1,
  __component: "sections.post-list",
  posts: [
    {
      id: 1,
      documentId: "post-1",
      title: "Understanding concussion recovery",
      slug: "understanding-concussion-recovery",
      excerpt:
        "Learn about the steps that support a safe and informed return to activity.",
    },
    {
      id: 2,
      documentId: "post-2",
      title: "When to seek medical care",
      slug: "when-to-seek-medical-care",
      excerpt:
        "Important signs and symptoms to discuss with a healthcare professional.",
    },
  ],
} as unknown as Data.Component<"sections.post-list">

export default function MockedStrapiPostList() {
  return <StrapiPostList component={data} />
}
