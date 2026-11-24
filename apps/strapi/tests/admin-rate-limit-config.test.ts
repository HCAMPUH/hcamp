import { describe, expect, it } from "vitest"

import adminConfig from "../config/admin"

describe("Strapi admin rate limit configuration", () => {
  it("limits admin authentication to five attempts per IP every 15 minutes", () => {
    const config = adminConfig({
      env: (key: string) =>
        key.startsWith("MICROSOFT_") ? "test-value" : undefined,
    })

    expect(config.rateLimit).toMatchObject({
      enabled: true,
      interval: { min: 15 },
      max: 5,
    })
    expect(
      config.rateLimit.keyGenerator({ request: { ip: "203.0.113.1" } })
    ).toBe("203.0.113.1")
  })
})
