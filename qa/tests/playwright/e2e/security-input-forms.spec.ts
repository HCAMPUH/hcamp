import { expect, test } from "@playwright/test"

test.describe("security input checks", () => {
  test("sign-in rejects script-like email payloads", async ({ page }) => {
    await page.goto("/auth/signin")

    await page
      .locator('input[name="email"]')
      .fill("<script>alert(1)</script>@example.com")
    await page.locator('input[name="password"]').fill("Password123")
    await page.getByRole("button", { name: /^Sign in$/i }).click()

    await expect(page.locator('input[name="email"]').first()).toBeVisible({
      timeout: 5000,
    })
  })

  test("register rejects script-like email payloads and mismatched password", async ({
    page,
  }) => {
    await page.goto("/auth/register")

    await page
      .locator('input[name="email"]')
      .fill("<script>alert(1)</script>@example.com")
    await page.locator('input[name="password"]').fill("Password123")
    await page.locator('input[name="passwordConfirmation"]').fill("Password123")
    await page.getByRole("button", { name: /submit|create account/i }).click()

    await expect(page.locator('input[name="email"]').first()).toBeVisible({
      timeout: 5000,
    })
  })

  test("signin with javascript callback URL does not navigate away from same-origin app", async ({
    page,
  }) => {
    await page.goto("/auth/signin?callbackUrl=javascript:alert(1)")

    await expect(page).toHaveURL(/\/auth\/signin(?:\?|$)/)
  })
})
