"use client"

import { useMutation } from "@tanstack/react-query"

import { PublicStrapiClient } from "@/lib/strapi-api"

export function useContactForm() {
  return useMutation({
    mutationFn: (values: {
      name: string
      email: string
      message: string
      newsletter: boolean
      recaptchaToken: string
    }) => {
      const path = PublicStrapiClient.getStrapiApiPathByUId(
        "api::subscriber.subscriber"
      )

      return PublicStrapiClient.fetchAPI(
        path,
        undefined,
        {
          method: "POST",
          body: JSON.stringify({
            data: {
              name: values.name,
              email: values.email,
              message: values.message,
              newsletter: values.newsletter,
            },
            recaptchaToken: values.recaptchaToken,
          }),
        },
        { useProxy: true }
      )
    },
  })
}

export function useNewsletterForm() {
  return useMutation({
    mutationFn: (values: {
      name: string
      email: string
      recaptchaToken: string
    }) => {
      const path = PublicStrapiClient.getStrapiApiPathByUId(
        "api::subscriber.subscriber"
      )
      const { recaptchaToken, ...subscriberValues } = values

      return PublicStrapiClient.fetchAPI(
        path,
        undefined,
        {
          method: "POST",
          body: JSON.stringify({
            data: {
              ...subscriberValues,
              newsletter: true,
            },
            recaptchaToken,
          }),
        },
        { useProxy: true }
      )
    },
  })
}
