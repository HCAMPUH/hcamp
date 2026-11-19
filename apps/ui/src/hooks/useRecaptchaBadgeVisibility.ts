"use client"

import { useEffect } from "react"

let activeRecaptchaForms = 0

export function useRecaptchaBadgeVisibility() {
  useEffect(() => {
    activeRecaptchaForms += 1
    document.body.classList.add("recaptcha-active")

    return () => {
      activeRecaptchaForms -= 1
      if (activeRecaptchaForms === 0) {
        document.body.classList.remove("recaptcha-active")
      }
    }
  }, [])
}
