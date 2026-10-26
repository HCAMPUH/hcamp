"use client"

import { useMutation } from "@tanstack/react-query"

import { PublicStrapiClient } from "@/lib/strapi-api"

type PledgeValues = {
  firstName: string
  lastName: string
  schoolOrganization: string
}

export function usePledgeForm() {
  return useMutation({
    mutationFn: (values: PledgeValues) => {
      const path = `${PublicStrapiClient.getStrapiApiPathByUId("api::pledge.pledge")}/submit`

      return PublicStrapiClient.fetchAPI(
        path,
        undefined,
        {
          method: "POST",
          body: JSON.stringify({ data: values }),
        },
        { useProxy: true }
      )
    },
  })
}
