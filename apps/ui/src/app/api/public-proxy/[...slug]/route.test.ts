import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const {
  createStrapiAuthHeaderMock,
  fetchMock,
  getEnvVarMock,
  isStrapiEndpointAllowedMock,
  verifyRecaptchaMock,
} = vi.hoisted(() => ({
  createStrapiAuthHeaderMock: vi.fn(),
  fetchMock: vi.fn(),
  getEnvVarMock: vi.fn(),
  isStrapiEndpointAllowedMock: vi.fn(),
  verifyRecaptchaMock: vi.fn(),
}))

vi.mock("@/lib/env-vars", () => ({
  getEnvVar: getEnvVarMock,
}))

vi.mock("@/lib/recaptcha", () => ({
  verifyRecaptcha: verifyRecaptchaMock,
}))

vi.mock("@/lib/strapi-api/request-auth", () => ({
  createStrapiAuthHeader: createStrapiAuthHeaderMock,
  isStrapiEndpointAllowed: isStrapiEndpointAllowedMock,
}))

import { POST } from "./route"

const makeRequest = (payload: unknown, path = "api/subscribers") =>
  new Request(`http://localhost/api/public-proxy/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

const routeContext = {
  params: Promise.resolve({ slug: ["api", "subscribers"] }),
}
const pledgeRouteContext = {
  params: Promise.resolve({ slug: ["api", "pledges", "submit"] }),
}

describe("POST /api/public-proxy/api/subscribers", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getEnvVarMock.mockImplementation((name: string) =>
      name === "STRAPI_URL" ? "https://strapi.test" : "test-secret"
    )
    isStrapiEndpointAllowedMock.mockReturnValue(true)
    createStrapiAuthHeaderMock.mockResolvedValue({})
    verifyRecaptchaMock.mockResolvedValue(true)
    fetchMock.mockResolvedValue(
      Response.json(
        { data: { id: 1 } },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
    )
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("rejects contact submissions without a valid reCAPTCHA token", async () => {
    verifyRecaptchaMock.mockResolvedValue(false)

    const response = await POST(
      makeRequest({
        data: { name: "A", email: "a@example.com", message: " " },
      }),
      routeContext
    )

    expect(response.status).toBe(403)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("protects the trailing-slash subscriber endpoint variant", async () => {
    verifyRecaptchaMock.mockResolvedValue(false)

    const response = await POST(
      makeRequest({
        data: { name: "A", email: "a@example.com", message: "Hello" },
      }),
      { params: Promise.resolve({ slug: ["api", "subscribers", ""] }) }
    )

    expect(response.status).toBe(403)
    expect(verifyRecaptchaMock).toHaveBeenCalledWith(undefined, "contact_form")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("fails closed when the reCAPTCHA secret is missing", async () => {
    getEnvVarMock.mockImplementation((name: string) =>
      name === "STRAPI_URL" ? "https://strapi.test" : ""
    )

    const response = await POST(
      makeRequest({
        data: { name: "A", email: "a@example.com", message: "Hello" },
        recaptchaToken: "test-token",
      }),
      routeContext
    )

    expect(response.status).toBe(503)
    expect(verifyRecaptchaMock).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("verifies and removes the token before forwarding a contact submission", async () => {
    const payload = {
      data: { name: "A", email: "a@example.com", message: "Hello" },
      recaptchaToken: "test-token",
    }

    const response = await POST(makeRequest(payload), routeContext)

    expect(response.status).toBe(200)
    expect(verifyRecaptchaMock).toHaveBeenCalledWith(
      "test-token",
      "contact_form"
    )
    expect(fetchMock).toHaveBeenCalledWith(
      "https://strapi.test/api/subscribers",
      expect.objectContaining({
        body: JSON.stringify({ data: payload.data }),
      })
    )
  })

  it("verifies and removes the token before forwarding a newsletter submission", async () => {
    const payload = {
      data: { name: "A", email: "a@example.com", newsletter: true },
      recaptchaToken: "newsletter-token",
    }

    const response = await POST(makeRequest(payload), routeContext)

    expect(response.status).toBe(200)
    expect(verifyRecaptchaMock).toHaveBeenCalledWith(
      "newsletter-token",
      "newsletter_form"
    )
    expect(fetchMock).toHaveBeenCalledWith(
      "https://strapi.test/api/subscribers",
      expect.objectContaining({ body: JSON.stringify({ data: payload.data }) })
    )
  })

  it("rejects newsletter submissions with an invalid reCAPTCHA token", async () => {
    verifyRecaptchaMock.mockResolvedValue(false)

    const response = await POST(
      makeRequest({
        data: { name: "A", email: "a@example.com", newsletter: true },
        recaptchaToken: "bad-token",
      }),
      routeContext
    )

    expect(response.status).toBe(403)
    expect(verifyRecaptchaMock).toHaveBeenCalledWith(
      "bad-token",
      "newsletter_form"
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("verifies and removes the token before forwarding a pledge", async () => {
    const payload = {
      data: {
        firstName: "A",
        lastName: "B",
        schoolOrganization: "School",
      },
      recaptchaToken: "pledge-token",
    }

    const response = await POST(
      makeRequest(payload, "api/pledges/submit"),
      pledgeRouteContext
    )

    expect(response.status).toBe(200)
    expect(verifyRecaptchaMock).toHaveBeenCalledWith(
      "pledge-token",
      "pledge_form"
    )
    expect(createStrapiAuthHeaderMock).toHaveBeenCalledWith({
      isReadOnly: false,
      isPrivate: false,
    })
    expect(fetchMock).toHaveBeenCalledWith(
      "https://strapi.test/api/pledges/submit",
      expect.objectContaining({
        body: JSON.stringify({ data: payload.data }),
      })
    )
  })

  it("rejects pledges with an invalid reCAPTCHA token", async () => {
    verifyRecaptchaMock.mockResolvedValue(false)

    const response = await POST(
      makeRequest(
        {
          data: {
            firstName: "A",
            lastName: "B",
            schoolOrganization: "School",
          },
          recaptchaToken: "bad-token",
        },
        "api/pledges/submit"
      ),
      pledgeRouteContext
    )

    expect(response.status).toBe(403)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
