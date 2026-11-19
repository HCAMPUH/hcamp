---
sidebar_position: 2
---

# reCAPTCHA

reCAPTCHA v3 is a spam and abuse protection service that scores form submissions without showing a user challenge.

reCAPTCHA helpers are pre-configured in:

```txt
apps/ui/src/lib/recaptcha.ts
```

Required env vars:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...
```

The contact form is wrapped in `ReCaptchaProvider` and executes reCAPTCHA v3 with the `contact_form` action when submitted. The newsletter form uses the `newsletter_form` action. The browser only collects each token; the public proxy verifies its score and action on the server before forwarding either submission to Strapi.

The site key is exposed through runtime CSR config, so it can be changed without rebuilding the UI. Set both variables above in the UI deployment.

Pledge submissions use the same flow with the `pledge_form` action. The Strapi `pledges/submit` route requires authentication; grant the UI custom API token permission to submit pledges so the proxy can forward verified submissions.

## UI Usage

```tsx
import { ReCaptchaProvider } from "next-recaptcha-v3"
import { getEnvVar } from "@/lib/env-vars"

return (
  <ReCaptchaProvider reCaptchaKey={getEnvVar("NEXT_PUBLIC_RECAPTCHA_SITE_KEY")}>
    <ContactUsForm />
  </ReCaptchaProvider>
)
```

```tsx
"use client"

import { useReCaptcha } from "next-recaptcha-v3"
import { submitContactUsForm } from "./actions"

export const ContactUsForm = () => {
  const { executeRecaptcha } = useReCaptcha()

  const submit = async (formData: FormData) => {
    const token = await executeRecaptcha("contact_form")
    formData.set("recaptchaToken", token)

    await submitContactUsForm(formData)
  }

  return <form action={submit}>{/* fields */}</form>
}
```

## Server Validation

```tsx
import { verifyRecaptcha } from "@/lib/recaptcha"

export const submitContactUsForm = async (payload: FormData) => {
  const token = payload.get("recaptchaToken")
  if (!(await verifyRecaptcha(token, "contact_form"))) {
    throw new Error("Invalid reCAPTCHA")
  }

  return { success: true }
}
```
