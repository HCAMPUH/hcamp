import type { Data } from "@repo/strapi-types"

import StrapiAbout from "@/components/page-builder/components/sections/StrapiAbout"

const data = {
  id: 1,
  __component: "sections.about",
  backgroundColor: "#111827",
  eyebrow: "Institutional Program",
  title: "About HCAMP",
  description:
    "The Hawai‘i Concussion Awareness and Management Program (HCAMP) was established to create a unified, statewide standard of care for concussions across Hawai‘i's youth, schools, and athletic organizations.",
  resources: [
    {
      id: 1,
      title: "Mission & Vision",
      description:
        "Read our core purpose and strategic vision for Hawai‘i sports health.",
      link: {
        id: 1,
        __component: "utilities.link",
        type: "external",
        label: "Read Mission & Vision",
        href: "#",
        newTab: false,
      },
    },
    {
      id: 2,
      title: "Strategic Plan",
      description:
        "Review five-year goals and educational expansion benchmarks.",
      link: {
        id: 2,
        __component: "utilities.link",
        type: "external",
        label: "Read Strategic Plan",
        href: "#",
        newTab: false,
      },
    },
    {
      id: 3,
      title: "Annual Report",
      description: "Download fiscal updates, outreach stats, and impact data.",
      link: {
        id: 3,
        __component: "utilities.link",
        type: "external",
        label: "Download Annual Report",
        href: "#",
        newTab: false,
      },
    },
    {
      id: 4,
      title: "Personnel Bios",
      description:
        "Meet our medical directors, athletic trainers, and researchers.",
      link: {
        id: 4,
        __component: "utilities.link",
        type: "external",
        label: "Meet the Team",
        href: "#",
        newTab: false,
      },
    },
  ],
  institutionEyebrow: "Housed & Operated At",
  institutionLogo: null,
  institutionDescription:
    "HCAMP is proudly housed at the University of Hawai‘i at Mānoa, College of Education, Department of Kinesiology and Rehabilitation Science.",
  partnersEyebrow: "Collaborators & Key Partners",
  partners: [
    {
      id: 1,
      name: "Hawai‘i DOE",
      link: {
        id: 5,
        __component: "utilities.link",
        type: "external",
        label: "Hawai‘i DOE",
        href: "#",
        newTab: false,
      },
    },
    { id: 2, name: "HHSAA Athletics" },
    { id: 3, name: "Queen's Health" },
  ],
} as unknown as Data.Component<"sections.about">

export default function MockedStrapiAbout() {
  return <StrapiAbout component={data} />
}
