import type { Data } from "@repo/strapi-types"

import StrapiNewsletterForm from "@/components/page-builder/components/forms/StrapiNewsletterForm"

const data = {
  id: 1,
  __component: "forms.newsletter-form",
  title: "Stay informed about concussion care",
  description: "Get practical updates, resources, and program news from HCAMP.",
  gdpr: {
    href: "/privacy",
    label: "Privacy policy",
    newTab: false,
  },
} as unknown as Data.Component<"forms.newsletter-form">

export default function MockedStrapiNewsletterForm() {
  return <StrapiNewsletterForm component={data} />
}
