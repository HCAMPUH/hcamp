import type { Data } from "@repo/strapi-types"

import StrapiEventsAndResearch from "@/components/page-builder/components/sections/StrapiEventsAndResearch"

const data = {
  id: 1,
  __component: "sections.events-and-research",
  eventsEyebrow: "Community outreach",
  eventsTitle: "Events & Advocate Projects",
  eventsDescription:
    "Discover upcoming workshops and student-led initiatives across Hawaii high schools.",
  events: [
    {
      id: 1,
      documentId: "event-1",
      title: "HCAMP Annual Concussion Management Workshop",
      slug: "hcamp-annual-concussion-management-workshop",
      eventDate: "2026-04-18",
      eventTime: "9:00 AM - 2:00 PM",
      location: "UH Manoa & Online",
    },
    {
      id: 2,
      documentId: "event-2",
      title: "Leilehua HS Advocate Youth Safety Summit",
      slug: "leilehua-hs-advocate-youth-safety-summit",
      eventDate: "2026-05-02",
      location: "Leilehua High School",
      eventSpeakers: "Julian Lai & Kai McDermott",
    },
  ],
  eventHighlightLabel: "HCAMP High School Advocates Showcase",
  eventHighlightTitle: "Leilehua High School Student Leadership",
  eventHighlightDescription:
    "High school advocates lead peer-to-peer concussion education programs at Leilehua High School.",
  researchEyebrow: "Academic excellence",
  researchTitle: "HCAMP Research Catalog",
  researchDescription:
    "Peer-reviewed publications and clinical studies produced by HCAMP investigators at UH Manoa.",
  researchItems: [
    {
      id: 1,
      journal: "Journal of Athletic Training",
      year: 2024,
      title:
        "Concussion Knowledge and Reporting Behaviors Among High School Athletes in Hawaii",
      description:
        "Investigating cultural factors, peer dynamics, and baseline testing effectiveness across Hawaii island high schools.",
      link: {
        type: "external",
        label: "Read Abstract & PDF",
        href: "https://example.com/research/concussion-knowledge",
        newTab: true,
      },
    },
    {
      id: 2,
      journal: "Hawaii Journal of Health & Social Welfare",
      year: 2023,
      title:
        "Implementation of Statewide Return-to-Learn Protocols in Hawaii Public Schools",
      description:
        "Evaluating classroom accommodation strategies and teacher training models in K-12 environments.",
      link: {
        type: "external",
        label: "Read Abstract & PDF",
        href: "https://example.com/research/return-to-learn",
        newTab: true,
      },
    },
  ],
} as unknown as Data.Component<"sections.events-and-research">

export default function MockedStrapiEventsAndResearch() {
  return <StrapiEventsAndResearch component={data} />
}
