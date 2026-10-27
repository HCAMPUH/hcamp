"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { pledgeOrganizations } from "@/components/elementary/forms/pledgeOrganizations"
import { AppField } from "@/components/forms/AppField"
import { AppForm } from "@/components/forms/AppForm"
import { Button } from "@/components/ui/button"
import { usePledgeForm } from "@/hooks/usePledgeForm"

const PledgeFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  schoolOrganization: z.string().min(1),
})

type PledgeFormValues = z.infer<typeof PledgeFormSchema>

export type SubmittedPledge = PledgeFormValues & {
  documentId: string
}

export function PledgeForm({
  submitLabel,
  onSubmitted,
}: Readonly<{
  submitLabel?: string | null
  onSubmitted?: (pledge: SubmittedPledge) => void
}>) {
  const t = useTranslations("pledgeForm")
  const pledgeMutation = usePledgeForm()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const form = useForm<PledgeFormValues>({
    resolver: zodResolver(PledgeFormSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      schoolOrganization: "",
    },
  })

  const onSubmit = (values: PledgeFormValues) => {
    setIsSubmitted(false)
    pledgeMutation.mutate(values, {
      onSuccess: (response) => {
        const submittedPledge = (
          response as { data?: Partial<SubmittedPledge> }
        ).data
        const pledge: SubmittedPledge = {
          ...values,
          ...submittedPledge,
          documentId: submittedPledge?.documentId ?? `local-${Date.now()}`,
        }

        toast.success(t("success"))
        form.reset()
        setIsSubmitted(true)
        onSubmitted?.(pledge)
      },
    })
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      <AppForm
        form={form}
        onSubmit={onSubmit}
        id="pledge-form"
        className="flex h-full w-full flex-col [&>fieldset]:flex [&>fieldset]:h-full [&>fieldset]:flex-col"
        disabled={pledgeMutation.isPending}
      >
        <AppField
          name="firstName"
          type="text"
          required
          label={t("firstName")}
          placeholder={t("firstNamePlaceholder")}
          autoComplete="given-name"
        />
        <AppField
          name="lastName"
          type="text"
          required
          label={t("lastName")}
          placeholder={t("lastNamePlaceholder")}
          autoComplete="family-name"
        />
        <AppField
          name="schoolOrganization"
          type="text"
          required
          label={t("schoolOrganization")}
          placeholder={t("schoolOrganizationPlaceholder")}
          autoComplete="organization"
          list="pledge-organizations"
        />
        <Button
          type="submit"
          className="pledge-button relative min-h-12 w-full flex-1 overflow-visible px-8 text-base"
          size="lg"
          form="pledge-form"
          isLoading={pledgeMutation.isPending}
          data-submitted={isSubmitted ? "true" : undefined}
        >
          {isSubmitted ? (
            <>
              <span
                className="pledge-button-spark pledge-button-spark-one"
                aria-hidden="true"
              />
              <span
                className="pledge-button-spark pledge-button-spark-two"
                aria-hidden="true"
              />
              <span
                className="pledge-button-spark pledge-button-spark-three"
                aria-hidden="true"
              />
              <span
                className="pledge-button-spark pledge-button-spark-four"
                aria-hidden="true"
              />
              <Check
                className="pledge-button-check size-5"
                aria-hidden="true"
              />
              {t("submitted")}
            </>
          ) : (
            submitLabel || t("submit")
          )}
        </Button>
      </AppForm>
      <datalist id="pledge-organizations">
        {pledgeOrganizations.map((organization) => (
          <option key={organization} value={organization} />
        ))}
      </datalist>

      {pledgeMutation.error && (
        <p className="text-destructive mt-4 text-center">{t("error")}</p>
      )}
    </div>
  )
}
