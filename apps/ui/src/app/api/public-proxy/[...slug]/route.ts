import { NextResponse } from "next/server"

import { getEnvVar } from "@/lib/env-vars"
import { verifyRecaptcha } from "@/lib/recaptcha"
import {
  createStrapiAuthHeader,
  isStrapiEndpointAllowed,
} from "@/lib/strapi-api/request-auth"

const invalidSubscriberPayload = () =>
  NextResponse.json(
    {
      error: {
        message: "Invalid subscriber payload",
        name: "BadRequest",
      },
    },
    { status: 400 }
  )

async function prepareSubscriberPayload(
  body: string | Blob | undefined
): Promise<{ body: string } | { response: NextResponse }> {
  if (typeof body !== "string") {
    return { response: invalidSubscriberPayload() }
  }

  let parsedPayload: unknown
  try {
    parsedPayload = JSON.parse(body)
  } catch {
    return { response: invalidSubscriberPayload() }
  }

  if (
    typeof parsedPayload !== "object" ||
    parsedPayload === null ||
    Array.isArray(parsedPayload)
  ) {
    return { response: invalidSubscriberPayload() }
  }

  const payload = parsedPayload as Record<string, unknown>
  const data =
    typeof payload.data === "object" && payload.data !== null
      ? (payload.data as Record<string, unknown>)
      : undefined
  const message = data?.message

  if (message) {
    if (!getEnvVar("RECAPTCHA_SECRET_KEY")) {
      return {
        response: NextResponse.json(
          {
            error: {
              message: "reCAPTCHA is not configured",
              name: "ServiceUnavailable",
            },
          },
          { status: 503 }
        ),
      }
    }

    const token =
      typeof payload.recaptchaToken === "string"
        ? payload.recaptchaToken
        : undefined
    if (!(await verifyRecaptcha(token, "contact_form"))) {
      return {
        response: NextResponse.json(
          { error: { message: "Invalid reCAPTCHA", name: "Forbidden" } },
          { status: 403 }
        ),
      }
    }
  }

  const { recaptchaToken: _recaptchaToken, ...strapiPayload } = payload

  return { body: JSON.stringify(strapiPayload) }
}

/**
 * This route handler acts as a public proxy for frontend requests with two primary goals:
 * - Hide the authenticated API token from the client (for both SSR and client-side components).
 * - Hide the backend URL, so it cannot be accessed directly.
 *
 * It is a public proxy that injects the Strapi API token (https://docs.strapi.io/cms/features/api-tokens) into the request.
 *
 * Since the STRAPI_REST_READONLY_API_KEY is injected into every GET request and Strapi does not block findOne and findMany
 * operations for any content type, this proxy checks if the requested content type is allowed to be fetched.
 */
async function handler(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params

  const path = Array.isArray(slug) ? slug.join("/") : slug

  const isAccessible = isStrapiEndpointAllowed(path, request.method)
  if (!isAccessible) {
    return NextResponse.json(
      {
        error: {
          message: `Path '${path}' is not accessible`,
          name: "Forbidden",
        },
      },
      { status: 403 }
    )
  }

  const strapiUrl = getEnvVar("STRAPI_URL", true)
  const { search } = new URL(request.url)
  const url = `${strapiUrl!}/${path}${search ?? ""}`
  const isReadOnly = request.method === "GET" || request.method === "HEAD"

  const clonedRequest = request.clone()
  const requestHeaders = new Headers(clonedRequest.headers)
  // Extract the body explicitly from the cloned request
  let body: string | Blob | undefined
  if (!isReadOnly) {
    const contentType = clonedRequest.headers.get("content-type")

    // eslint-disable-next-line unicorn/prefer-ternary
    if (contentType?.includes("multipart/form-data")) {
      // File upload - preserve FormData as blob
      body = await clonedRequest.blob()
    } else {
      // Regular API call - use text for JSON
      body = await clonedRequest.text()
    }
  }

  if (
    (path === "api/subscribers" || path === "api/subscribers/") &&
    request.method === "POST"
  ) {
    const result = await prepareSubscriberPayload(body)
    if ("response" in result) {
      return result.response
    }
    body = result.body
    requestHeaders.delete("content-length")
    requestHeaders.delete("transfer-encoding")
  }

  const authHeader = await createStrapiAuthHeader({
    isReadOnly,
    isPrivate: false,
    usePublicRole: path === "api/pledges/submit" && request.method === "POST",
  })

  const response = await fetch(url, {
    headers: {
      // Convert headers to object
      ...Object.fromEntries(requestHeaders),
      // Override the Authorization header with the injected token
      ...authHeader,
    },
    body,
    // this needs to be explicitly stated, because it is defaulted to GET
    method: request.method,
  })

  // Remove encoding headers, because the body is no longer compressed and the browser/client will choke on it.
  // (Built-in fetch in Node.js decompresses the body if the response has Content-Encoding: gzip
  // and gives the decompressed stream.)
  const responseHeaders = new Headers(response.headers)
  responseHeaders.delete("content-encoding")
  responseHeaders.delete("content-length")

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
}

export {
  handler as DELETE,
  handler as GET,
  handler as HEAD,
  handler as POST,
  handler as PUT,
}
