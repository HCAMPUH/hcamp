"use client"

import { UserRound } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { PledgeForm } from "@/components/elementary/forms/PledgeForm"
import { Typography } from "@/components/typography"

type PledgeListItem = {
  documentId: string
  firstName: string
  lastName: string
  schoolOrganization: string
}

type Props = {
  title: string
  description?: string | null
  eyebrow?: string | null
  submitLabel?: string | null
  initialPledgeCount: number
  pledges: PledgeListItem[]
}

const capitalizeWords = (value: string) =>
  value.replaceAll(/\b\p{L}/gu, (letter) => letter.toUpperCase())

export function PledgeContent({
  title,
  description,
  eyebrow,
  submitLabel,
  initialPledgeCount,
  pledges,
}: Props) {
  const t = useTranslations("pledgeForm")
  const [pledgeCount, setPledgeCount] = useState(initialPledgeCount)

  return (
    <div className="border-border bg-muted/30 mx-auto max-w-5xl rounded-2xl border p-6 sm:p-10">
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div>
            {eyebrow ? (
              <div className="bg-brand-gold-soft text-brand-gold-muted dark:bg-brand-gold-muted/20 mb-2 inline-flex rounded-full px-3 py-1 text-xs font-extrabold uppercase dark:text-yellow-200">
                {eyebrow}
              </div>
            ) : null}
            <Typography
              tag="h3"
              variant="medium"
              fontWeight="extraBold"
              className="text-2xl"
            >
              {title}
            </Typography>
            {description ? (
              <Typography
                variant="medium"
                className="text-muted-foreground mt-2 text-sm leading-relaxed"
              >
                {description}
              </Typography>
            ) : null}
          </div>
          <PledgeForm
            submitLabel={submitLabel}
            onSubmitted={() => setPledgeCount((count) => count + 1)}
          />
        </div>

        <div className="border-border bg-card space-y-4 rounded-2xl border p-5 lg:col-span-5">
          <Typography
            className="border-border flex min-w-0 items-center justify-between gap-3 border-b pb-4"
            variant="large"
          >
            <span className="text-muted-foreground min-w-0 text-sm leading-tight">
              {t("countLabel")}
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#008751] bg-[#008751] px-3 py-1.5 text-white">
              <span className="text-2xl leading-none font-normal tabular-nums">
                {pledgeCount}
              </span>
              <UserRound className="size-4" aria-hidden="true" />
            </span>
          </Typography>
          <div className="divide-border max-h-[34rem] min-w-0 divide-y overflow-x-hidden overflow-y-auto pr-1">
            {pledges.map((pledge) => (
              <div
                key={pledge.documentId}
                className="hover:bg-muted/40 min-w-0 px-1 py-2 transition-colors"
              >
                <Typography
                  variant="small"
                  className="min-w-0 text-xs leading-snug [overflow-wrap:anywhere] break-words"
                >
                  <span className="font-semibold">
                    {pledge.firstName.charAt(0).toUpperCase()}.{" "}
                    {capitalizeWords(pledge.lastName)}
                  </span>
                  <span className="text-muted-foreground">
                    {", "}
                    {capitalizeWords(pledge.schoolOrganization)}
                  </span>
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
