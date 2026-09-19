import { type NextRequest, NextResponse } from "next/server"

import { isDevelopment } from "@/lib/general-helpers"

/**
 * Redirects non-HTTPS requests to HTTPS in production (e.g. Heroku).
 * Returns null if no redirect is needed.
 */
export const httpsRedirect = (req: NextRequest): NextResponse | null => {
  const xForwardedProto = req.headers.get("x-forwarded-proto")
  const host = req.headers.get("host") ?? ""
  const firstColon = host.indexOf(":")
  const hostname = host.startsWith("[")
    ? host.slice(1, host.indexOf("]"))
    : firstColon !== host.lastIndexOf(":")
      ? host
      : (host.split(":", 1)[0] ?? "")
  const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(hostname)
  const isDev = isDevelopment() || isLocalhost

  if (
    !isDev &&
    (xForwardedProto === null || !xForwardedProto.includes("https"))
  ) {
    return NextResponse.redirect(
      `https://${req.headers.get("host")}${req.nextUrl.pathname}${req.nextUrl.search}`,
      301
    )
  }

  return null
}
