"use client"

import type { Data } from "@repo/strapi-types"
import {
  BookOpen,
  CheckCircle2,
  Download,
  Flag,
  Megaphone,
  Trophy,
  Users,
} from "lucide-react"
import { useState } from "react"

import { Container } from "@/components/elementary/Container"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

const icons = {
  users: Users,
  megaphone: Megaphone,
  trophy: Trophy,
  "book-open": BookOpen,
  flag: Flag,
}

export function StrapiPortals({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.portals">
}) {
  const roles = component.roles ?? []
  const [activeIndex, setActiveIndex] = useState(0)
  const activeRole = roles[activeIndex] ?? roles[0]

  if (!activeRole) return null

  const courses = activeRole.courses ?? []

  return (
    <section className="border-b border-slate-200 bg-white py-20">
      <Container>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold tracking-widest text-red-900 uppercase">
            {component.eyebrow}
          </span>
          <Typography
            tag="h2"
            variant="heading1"
            fontWeight="extraBold"
            className="mt-3 mb-4"
          >
            {component.title}
          </Typography>
          <Typography variant="medium" className="text-slate-600">
            {component.description}
          </Typography>
        </div>

        <div className="mx-auto mb-10 flex max-w-4xl flex-wrap justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 shadow-inner">
          <div className="contents">
            {roles.map((role, index) => {
              const Icon = icons[role.icon ?? "users"] ?? Users
              const isActive = index === activeIndex

              return (
                <button
                  key={role.id ?? role.label}
                  type="button"
                  aria-selected={isActive}
                  role="tab"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-slate-600 transition-colors sm:text-sm",
                    isActive && "bg-white text-red-900 shadow-sm"
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {role.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-10">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div>
                <div className="bg-brand-gold-soft text-brand-gold-muted mb-2 inline-flex rounded-full px-3 py-1 text-xs font-extrabold uppercase">
                  {activeRole.category}
                </div>
                <Typography
                  tag="h3"
                  variant="medium"
                  fontWeight="extraBold"
                  className="text-2xl"
                >
                  {activeRole.title}
                </Typography>
                <Typography
                  variant="medium"
                  className="mt-2 leading-relaxed text-slate-600"
                >
                  {activeRole.description}
                </Typography>
              </div>
              {activeRole.responsibilityHeading ? (
                <Typography
                  tag="h4"
                  variant="small"
                  fontWeight="bold"
                  className="tracking-wider uppercase"
                >
                  {activeRole.responsibilityHeading}
                </Typography>
              ) : null}
              {(activeRole.responsibilities ?? []).length > 0 ? (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(activeRole.responsibilities ?? []).map((item) => (
                    <li
                      key={item.id ?? item.text}
                      className="flex items-start gap-2 text-xs text-slate-600"
                    >
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-red-800"
                        aria-hidden="true"
                      />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex flex-wrap gap-3 pt-2">
                <StrapiLink
                  component={activeRole.primaryAction}
                  className="h-auto rounded-xl bg-red-900 px-5 py-2.5 text-xs font-bold text-white shadow transition-colors hover:bg-red-800"
                />
                <StrapiLink
                  component={activeRole.secondaryAction}
                  className="h-auto rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <Download
                    className="size-4 text-red-900"
                    aria-hidden="true"
                  />
                  {activeRole.secondaryAction?.label}
                </StrapiLink>
              </div>
            </div>

            {activeRole.coursesHeading ||
            activeRole.coursesLabel ||
            courses.length > 0 ? (
              <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  {activeRole.coursesHeading ? (
                    <Typography
                      tag="h4"
                      variant="small"
                      fontWeight="bold"
                      className="tracking-wider uppercase"
                    >
                      {activeRole.coursesHeading}
                    </Typography>
                  ) : null}
                  {activeRole.coursesLabel ? (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
                      {activeRole.coursesLabel}
                    </span>
                  ) : null}
                </div>
                <div className="space-y-3">
                  {courses.map((course) => (
                    <StrapiLink
                      key={course.id ?? course.title}
                      component={course.link}
                      className="group h-auto min-h-20 w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all hover:border-red-900"
                    >
                      <div className="min-w-0">
                        <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-900">
                          {course.audience}
                        </span>
                        <Typography
                          tag="p"
                          variant="small"
                          fontWeight="semiBold"
                          className="mt-0.5 leading-tight break-words whitespace-normal text-slate-800"
                        >
                          {course.title}
                        </Typography>
                      </div>
                    </StrapiLink>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}

StrapiPortals.displayName = "StrapiPortals"

export default StrapiPortals
