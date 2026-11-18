import { getEnvVar } from "@/lib/env-vars"

const verificationUrl = "https://www.google.com/recaptcha/api/siteverify"

export const verifyRecaptcha = async (
  token?: string,
  expectedAction?: string
): Promise<boolean> => {
  "use server"

  const secret = getEnvVar("RECAPTCHA_SECRET_KEY")

  if (!token || !secret) {
    return false
  }

  try {
    const params = new URLSearchParams({
      secret,
      response: token,
    })
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store",
    })

    if (!response.ok) {
      return false
    }

    const data: {
      success?: boolean
      score?: number
      action?: string
    } = await response.json()

    // reCAPTCHA v3 returns a score (0.0 - 1.0), usually accept > 0.5
    return (
      data.success === true &&
      typeof data.score === "number" &&
      data.score >= 0.5 &&
      (!expectedAction || data.action === expectedAction)
    )
  } catch {
    return false
  }
}
