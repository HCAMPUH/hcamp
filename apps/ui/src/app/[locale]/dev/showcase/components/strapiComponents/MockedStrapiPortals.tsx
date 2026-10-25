import type { Data } from "@repo/strapi-types"

import StrapiPortals from "@/components/page-builder/components/sections/StrapiPortals"

const portalActionLabel = "Access Portal Features"

const data = {
  id: 1,
  __component: "sections.portals",
  eyebrow: "Customized Learning Portals",
  title: "Select Your Population Identity",
  description:
    "Get tailored resources, symptom guidance, return-to-play/learn protocols, and direct access to BrainSpace online training courses specific to your role.",
  roles: [
    {
      id: 1,
      label: "Parents",
      icon: "users",
      category: "Home & Caregiver Guidance",
      title: "Parent Concussion Portal",
      description:
        "Parents play a vital role in symptom monitoring at home, ensuring optimal sleep and nutrition, coordinating school accommodations, and managing the return to physical activity.",
      responsibilityHeading: "Key Responsibilities & Resources:",
      responsibilities: [
        { id: 1, text: "Symptom monitoring at home checklist" },
        { id: 2, text: "Sleep and nutrition guidelines during recovery" },
        { id: 3, text: "Coordinating Return-to-Learn care with schools" },
        { id: 4, text: "Watch authentic Parent Testimony Videos" },
      ],
      primaryAction: {
        id: 1,
        __component: "utilities.link",
        type: "external",
        label: portalActionLabel,
        href: "#",
        newTab: false,
      },
      secondaryAction: {
        id: 2,
        __component: "utilities.link",
        type: "external",
        label: "Download Parent One-Page Infographic",
        href: "#",
        newTab: false,
      },
      coursesLabel: "Free Enrollment",
      coursesHeading: "BrainSpace Online Courses",
      courses: [
        {
          id: 1,
          audience: "HS/MS Parents",
          title: "High School / Middle School BrainSpace Course for Parents",
          link: {
            id: 3,
            __component: "utilities.link",
            type: "external",
            label: "Open course",
            href: "#",
            newTab: false,
          },
        },
        {
          id: 2,
          audience: "Youth League",
          title: "Youth BrainSpace Course for Parents",
          link: {
            id: 4,
            __component: "utilities.link",
            type: "external",
            label: "Open course",
            href: "#",
            newTab: false,
          },
        },
      ],
    },
    {
      id: 2,
      label: "Coaches",
      icon: "megaphone",
      category: "Sideline & Athletic Safety",
      title: "Coach Concussion Portal",
      description:
        "Coaches create a safe reporting environment, identify observable on-field concussion signs, enforce mandatory removal from play, and implement Return-to-Play progressions.",
      responsibilities: [
        { id: 5, text: "Creating an encouraging, safe reporting culture" },
        { id: 6, text: "Recognizing on-field observable concussion signs" },
        { id: 7, text: "Sideline evaluation protocols and removal step" },
        { id: 8, text: "Watch Coach Testimony & Observable Sign Videos" },
      ],
      primaryAction: {
        id: 5,
        __component: "utilities.link",
        type: "external",
        label: portalActionLabel,
        href: "#",
        newTab: false,
      },
      secondaryAction: {
        id: 6,
        __component: "utilities.link",
        type: "external",
        label: "Download Coach Sideline Infographic",
        href: "#",
        newTab: false,
      },
      coursesLabel: "Free Enrollment",
      coursesHeading: "BrainSpace Online Courses",
      courses: [
        {
          id: 3,
          audience: "Coaches",
          title: "High School / Middle School BrainSpace Course for Coaches",
          link: {
            id: 7,
            __component: "utilities.link",
            type: "external",
            label: "Open course",
            href: "#",
            newTab: false,
          },
        },
        {
          id: 4,
          audience: "Youth League",
          title: "Youth BrainSpace Course for Coaches",
          link: {
            id: 8,
            __component: "utilities.link",
            type: "external",
            label: "Open course",
            href: "#",
            newTab: false,
          },
        },
      ],
    },
    {
      id: 3,
      label: "Student Athletes",
      icon: "trophy",
      category: "Peer Support & Reporting",
      title: "Student Athlete Portal",
      description:
        "Student-athletes must understand the importance of reporting symptoms early. Read peer messages, overcome classroom challenges during recovery, and sign the Pledge to Report.",
      responsibilities: [
        {
          id: 9,
          text: "Importance of honest reporting to protect long-term brain health",
        },
        {
          id: 10,
          text: "Understanding problems encountered in classroom & daily recovery",
        },
        { id: 11, text: "Take the Pledge to Report and join the Honor Wall" },
        { id: 12, text: "Explore HCAMP High School Advocates Projects" },
      ],
      primaryAction: {
        id: 9,
        __component: "utilities.link",
        type: "external",
        label: portalActionLabel,
        href: "#",
        newTab: false,
      },
      secondaryAction: {
        id: 10,
        __component: "utilities.link",
        type: "external",
        label: "Download Athlete Guide Infographic",
        href: "#",
        newTab: false,
      },
      coursesLabel: "Free Enrollment",
      coursesHeading: "BrainSpace Online Courses",
      courses: [
        {
          id: 5,
          audience: "Athletes",
          title: "High School / Middle School Student Athlete Curriculum",
          link: {
            id: 11,
            __component: "utilities.link",
            type: "external",
            label: "Open course",
            href: "#",
            newTab: false,
          },
        },
      ],
    },
    {
      id: 4,
      label: "Educators",
      icon: "book-open",
      category: "Return-to-Learn Support",
      title: "Educator & Academic Staff Portal",
      description:
        "Teachers and academic staff guide students through cognitive rest and Return-to-Learn protocols, offering classroom accommodations and addressing social-emotional needs.",
      responsibilities: [
        {
          id: 13,
          text: "Understanding the educator's role in concussion recovery",
        },
        {
          id: 14,
          text: "Accessing Return-to-Learn guidelines and toolbox forms",
        },
        {
          id: 15,
          text: "Managing social-emotional concerns and academic stress",
        },
        { id: 16, text: "Download classroom accommodation handouts" },
      ],
      primaryAction: {
        id: 12,
        __component: "utilities.link",
        type: "external",
        label: portalActionLabel,
        href: "#",
        newTab: false,
      },
      secondaryAction: {
        id: 13,
        __component: "utilities.link",
        type: "external",
        label: "Download Educator Toolbox Packet",
        href: "#",
        newTab: false,
      },
      coursesLabel: "Free Enrollment",
      coursesHeading: "BrainSpace Online Courses",
      courses: [
        {
          id: 6,
          audience: "Teachers & Counselors",
          title: "BrainSpace Educator & Support Staff Curriculum",
          link: {
            id: 14,
            __component: "utilities.link",
            type: "external",
            label: "Open course",
            href: "#",
            newTab: false,
          },
        },
      ],
    },
    {
      id: 5,
      label: "Officials / Referees",
      icon: "flag",
      category: "On-Field Officiating Safety",
      title: "Officials & Referees Portal",
      description:
        "Sports officials maintain athlete safety by recognizing dangerous collisions, enforcing rule compliance, and halting play when a concussion is suspected.",
      responsibilities: [
        { id: 17, text: "Recognizing dangerous field collisions" },
        {
          id: 18,
          text: "Communicating with athletic trainers and head coaches",
        },
        { id: 19, text: "Official BrainSpace certification for game referees" },
      ],
      primaryAction: {
        id: 15,
        __component: "utilities.link",
        type: "external",
        label: portalActionLabel,
        href: "#",
        newTab: false,
      },
      secondaryAction: {
        id: 16,
        __component: "utilities.link",
        type: "external",
        label: "Download Official Sideline Protocol Guide",
        href: "#",
        newTab: false,
      },
      coursesLabel: "Free Enrollment",
      coursesHeading: "BrainSpace Online Courses",
      courses: [
        {
          id: 7,
          audience: "Game Officials",
          title: "BrainSpace Official & Referee Curriculum",
          link: {
            id: 17,
            __component: "utilities.link",
            type: "external",
            label: "Open course",
            href: "#",
            newTab: false,
          },
        },
      ],
    },
    {
      id: 6,
      label: "Healthcare Providers",
      icon: "heart-pulse",
      category: "Clinical Care & Recovery",
      title: "Healthcare Provider Portal",
      description:
        "Healthcare providers support accurate evaluation, coordinated recovery planning, and safe return-to-learn and return-to-play decisions.",
      responsibilityHeading: "Key Responsibilities & Resources:",
      responsibilities: [
        { id: 20, text: "Clinical evaluation and symptom monitoring" },
        {
          id: 21,
          text: "Coordinating recovery plans with families and schools",
        },
        {
          id: 22,
          text: "Guiding graduated return-to-learn and return-to-play protocols",
        },
      ],
      primaryAction: {
        id: 18,
        __component: "utilities.link",
        type: "external",
        label: "Access Portal Features",
        href: "#",
        newTab: false,
      },
      secondaryAction: {
        id: 19,
        __component: "utilities.link",
        type: "external",
        label: "Download Provider Resource Guide",
        href: "#",
        newTab: false,
      },
      coursesLabel: "Free Enrollment",
      coursesHeading: "BrainSpace Online Courses",
      courses: [
        {
          id: 8,
          title: "BrainSpace Course for Healthcare Providers",
          link: {
            id: 18,
            __component: "utilities.link",
            type: "external",
            label: "Open course",
            href: "#",
            newTab: false,
          },
        },
      ],
    },
  ],
} as unknown as Data.Component<"sections.portals">

export default function MockedStrapiPortals() {
  return <StrapiPortals component={data} />
}
