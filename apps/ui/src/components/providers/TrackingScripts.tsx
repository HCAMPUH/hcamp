import Script from "next/script"

import { isDevelopment } from "@/lib/general-helpers"

export function TrackingScriptWrapper({
  id,
  scriptContent,
  scriptOptions,
  ignoreInDevelopment = true,
}: {
  scriptContent: string
  id: string
  scriptOptions: Exclude<
    React.ComponentProps<typeof Script>,
    "id" | "dangerouslySetInnerHTML"
  >
  ignoreInDevelopment?: boolean
}) {
  if (ignoreInDevelopment && isDevelopment()) {
    return null
  }

  return (
    <Script
      id={id}
      dangerouslySetInnerHTML={{ __html: scriptContent }}
      {...scriptOptions}
    />
  )
}

function TrackingScripts() {
  if (isDevelopment()) {
    return null
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-97KMXTDRGC"
        strategy="afterInteractive"
      />
      <TrackingScriptWrapper
        id="google-analytics"
        scriptContent={`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-97KMXTDRGC');
        `}
        scriptOptions={{ strategy: "afterInteractive" }}
      />
    </>
  )
}

export default TrackingScripts
