"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronsRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { ReCaptchaProvider, useReCaptcha } from "next-recaptcha-v3"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { AppField } from "@/components/forms/AppField"
import { AppForm } from "@/components/forms/AppForm"
import { Button } from "@/components/ui/button"
import { useNewsletterForm } from "@/hooks/useAppForm"
import { useRecaptchaBadgeVisibility } from "@/hooks/useRecaptchaBadgeVisibility"
import { getEnvVar } from "@/lib/env-vars"
import { sanitizeEmailInput, sanitizeNameInput } from "@/lib/sanitize"

export function NewsletterForm() {
  const t = useTranslations("newsletterForm")

  const siteKey = getEnvVar("NEXT_PUBLIC_RECAPTCHA_SITE_KEY")
  if (!siteKey) {
    return (
      <p className="text-center text-red-500" role="alert">
        {t("error")}
      </p>
    )
  }

  return (
    <ReCaptchaProvider reCaptchaKey={siteKey}>
      <NewsletterFormFields />
    </ReCaptchaProvider>
  )
}

function NewsletterFormFields() {
  useRecaptchaBadgeVisibility()

  const t = useTranslations("newsletterForm")
  const { executeRecaptcha } = useReCaptcha()
  const newsletterMutation = useNewsletterForm()
  const form = useForm<z.infer<FormSchemaType>>({
    resolver: zodResolver(NewsletterFormSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: { name: "", email: "" },
  })

  async function onSubmit(values: z.infer<FormSchemaType>) {
    if (!executeRecaptcha) {
      toast.error(t("error"))

      return
    }

    const normalizedValues = {
      name: sanitizeNameInput(values.name, 120),
      email: sanitizeEmailInput(values.email),
    }

    try {
      const recaptchaToken = await executeRecaptcha("newsletter_form")
      newsletterMutation.mutate(
        { ...normalizedValues, recaptchaToken },
        {
          onSuccess: () => {
            toast.success(t("success"))
            form.reset()
          },
        }
      )
    } catch {
      toast.error(t("error"))
    }
  }

  return (
    <div className="flex w-full flex-col">
      <AppForm
        form={form}
        onSubmit={onSubmit}
        id={newsletterForm}
        className="w-full"
        disabled={form.formState.isSubmitting || newsletterMutation.isPending}
      >
        <AppField
          name="name"
          type="text"
          autoComplete="name"
          required
          label={t("name")}
          placeholder={t("namePlaceholder")}
        />
        <AppField
          name="email"
          type="email"
          autoComplete="email"
          required
          label={t("email")}
          placeholder={t("emailPlaceholder")}
        />
        <Button
          type="submit"
          className="mt-4 w-full"
          size="lg"
          form={newsletterForm}
          isLoading={
            form.formState.isSubmitting || newsletterMutation.isPending
          }
        >
          {t("submit")}
          <ChevronsRight className="size-5" aria-hidden="true" />
        </Button>
      </AppForm>
      {newsletterMutation.error && (
        <p className="text-destructive mt-4 text-sm" role="alert">
          {t("error")}
        </p>
      )}
    </div>
  )
}

const NewsletterFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().max(254).email(),
})

type FormSchemaType = typeof NewsletterFormSchema

export const newsletterForm = "newsletterForm"
