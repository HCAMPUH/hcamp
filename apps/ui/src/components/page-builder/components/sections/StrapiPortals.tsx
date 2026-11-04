"use client"

import type { Data } from "@repo/strapi-types"
import {
  BookOpen,
  CheckCircle2,
  Download,
  Flag,
  HeartPulse,
  Megaphone,
  Trophy,
  Users,
} from "lucide-react"
import { useState } from "react"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
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
  "heart-pulse": HeartPulse,
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
    <section id="hcamp-portals">
      <Container className="py-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {component.eyebrow ? (
            <span className="inline-flex rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-red-900 uppercase dark:border-red-700 dark:bg-red-950/40 dark:text-red-100">
              {component.eyebrow}
            </span>
          ) : null}
          {component.title ? (
            <Typography
              tag="h2"
              variant="heading2"
              fontWeight="extraBold"
              className="mt-3 !text-3xl leading-tight"
            >
              {component.title}
            </Typography>
          ) : null}
          {component.description ? (
            <Typography
              variant="medium"
              className="text-muted-foreground mt-2 text-sm"
            >
              {component.description}
            </Typography>
          ) : null}
        </div>

        <div
          className="border-border bg-muted mx-auto mb-10 flex max-w-5xl flex-wrap justify-center gap-2 rounded-2xl border p-1.5 shadow-inner"
          role="tablist"
          aria-label={component.title ?? "Portal roles"}
        >
          <div className="contents">
            {roles.map((role, index) => {
              const Icon = icons[role.icon ?? "users"] ?? Users
              const isActive = index === activeIndex
              const tabId = `portal-tab-${role.id ?? index}`
              const panelId = `portal-panel-${role.id ?? index}`

              return (
                <button
                  key={role.id ?? role.label}
                  id={tabId}
                  type="button"
                  aria-selected={isActive}
                  aria-controls={panelId}
                  role="tab"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "text-muted-foreground flex min-h-11 items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-colors sm:text-sm",
                    isActive &&
                      "bg-background text-red-950 shadow-sm dark:text-red-100"
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {role.label}
                </button>
              )
            })}
          </div>
        </div>

        <div
          id={`portal-panel-${activeRole.id ?? activeIndex}`}
          role="tabpanel"
          aria-labelledby={`portal-tab-${activeRole.id ?? activeIndex}`}
          className="border-border bg-muted/30 rounded-2xl border p-6 sm:p-10"
        >
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div>
                {activeRole.category ? (
                  <div className="bg-brand-gold-soft dark:bg-brand-gold-muted/20 mb-2 inline-flex rounded-full px-3 py-1 text-xs font-extrabold text-amber-900 uppercase dark:text-yellow-100">
                    {activeRole.category}
                  </div>
                ) : null}
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
                  className="text-muted-foreground mt-2 text-sm leading-relaxed"
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
                      className="text-muted-foreground flex items-start gap-2 text-xs"
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
                  className="h-auto rounded-xl bg-red-900 px-5 py-2.5 text-xs font-bold text-white shadow transition-colors hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700"
                />
                <StrapiLink
                  component={activeRole.secondaryAction}
                  className="border-border bg-background text-foreground hover:bg-muted h-auto rounded-xl border px-5 py-2.5 text-xs font-bold transition-colors"
                >
                  <Download
                    className="size-4 text-red-950"
                    aria-hidden="true"
                  />
                  {activeRole.secondaryAction?.label}
                </StrapiLink>
              </div>
            </div>

            {activeRole.coursesHeading ||
            activeRole.coursesLabel ||
            courses.length > 0 ? (
              <div className="border-border bg-card space-y-4 rounded-2xl border p-5 lg:col-span-5">
                <div className="border-border flex items-center justify-between border-b pb-4">
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
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">
                      {activeRole.coursesLabel}
                    </span>
                  ) : null}
                </div>
                {activeRole.image ? (
                  <div className="border-border border-b pb-4">
                    <StrapiBasicImage
                      component={activeRole.image}
                      className="mx-auto max-h-48 w-full object-contain"
                    />
                  </div>
                ) : null}
                <div className="space-y-3">
                  {courses.map((course) => (
                    <StrapiLink
                      key={course.id ?? course.title}
                      component={course.link}
                      className="group border-border bg-background h-auto min-h-20 w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all hover:border-red-900 dark:hover:border-red-700"
                    >
                      <div className="min-w-0">
                        {course.audience ? (
                          <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-950 dark:bg-red-950/40 dark:text-red-100">
                            {course.audience}
                          </span>
                        ) : null}
                        <Typography
                          tag="p"
                          variant="small"
                          fontWeight="semiBold"
                          className="text-foreground mt-0.5 leading-tight break-words whitespace-normal"
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
