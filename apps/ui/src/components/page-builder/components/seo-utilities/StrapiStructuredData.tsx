import type { Data } from "@repo/strapi-types"
import Script from "next/script"

export function StrapiStructuredData({
  structuredData,
}: {
  structuredData: Data.Component<"seo-utilities.seo">["structuredData"]
}) {
  if (structuredData) {
    return (
      <Script
        id="articleStructuredData"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    )
  }

  return null
}

StrapiStructuredData.displayName = "StructuredData"

export default StrapiStructuredData
