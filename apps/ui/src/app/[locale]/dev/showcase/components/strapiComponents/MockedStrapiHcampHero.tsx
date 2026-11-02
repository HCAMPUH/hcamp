import type { Data } from "@repo/strapi-types"

import StrapiHcampHero from "@/components/page-builder/components/sections/StrapiHcampHero"

const data = {
  id: 1,
  __component: "sections.hcamp-hero",
  badge: "Essential Health & Safety Knowledge",
  title:
    '<h1>What is a <span class="text-brand-red underline decoration-brand-red decoration-4 underline-offset-8">Concussion?</span></h1>',
  description:
    "<p>A concussion is a type of traumatic brain injury (TBI) caused by a bump, blow, or jolt to the head or by a hit to the body that causes the head and brain to move rapidly back and forth.</p>",
  figures: [
    {
      id: 1,
      prefix: "1 in ",
      number: 5,
      description: "<p>High school athletes experience a TBI during play</p>",
    },
    {
      id: 2,
      prefix: "",
      number: 1,
      suffix: " annual",
      description: "<p>State required education for coaches &amp; parents</p>",
    },
    {
      id: 3,
      prefix: "",
      number: 24,
      suffix: "/7",
      description: "<p>Evidence-based guidelines &amp; protocol tools</p>",
    },
  ],
  links: [
    {
      id: 1,
      type: "external",
      label: "Download Concussion Infographic",
      href: "#",
      newTab: false,
      decorations: { variant: "default", size: "lg", hasIcons: false },
    },
    {
      id: 2,
      type: "external",
      label: "Watch Explanation Video",
      href: "#",
      newTab: false,
      decorations: { variant: "outline", size: "lg", hasIcons: false },
    },
  ],
  videoLabel: "Educational video",
  videoTitle: "Understanding What Happens During a Concussion",
  videoUrl: "https://www.youtube.com/watch?v=VZlJZuurUH8",
} as unknown as Data.Component<"sections.hcamp-hero">

export default function MockedStrapiHcampHero() {
  return <StrapiHcampHero component={data} />
}
