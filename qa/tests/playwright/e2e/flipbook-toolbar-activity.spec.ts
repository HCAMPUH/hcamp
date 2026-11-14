import { readFile } from "node:fs/promises"
import path from "node:path"

import { expect, test } from "@playwright/test"

const helperPath = path.resolve(
  __dirname,
  "../../../../packages/react-pdf-flipbook-viewer/bundle/components/flipbook-viewer/toolbar/toolbar-activity.js"
)

declare global {
  interface Window {
    cleanupToolbarActivity: () => void
  }
}

test("viewer controls hide after inactivity and return on interaction", async ({
  page,
}) => {
  const start = new Date("2024-01-01T00:00:00Z")
  await page.clock.install({ time: start })
  await page.clock.pauseAt(start)
  await page.setContent(`
    <div id="viewer" tabindex="0">
      <div id="page">PDF page</div>
      <div id="toolbar"><button id="control">Next</button></div>
    </div>
    <button id="outside">Outside viewer</button>
  `)
  const helper = await readFile(helperPath, "utf8")
  await page.evaluate(async (source) => {
    const url = URL.createObjectURL(
      new Blob([source], { type: "text/javascript" })
    )
    try {
      const { setupToolbarActivity } = await import(url)
      const viewer = document.querySelector<HTMLElement>("#viewer")!
      const toolbar = document.querySelector<HTMLElement>("#toolbar")!
      // eslint-disable-next-line unicorn/no-global-object-property-assignment
      window.cleanupToolbarActivity = setupToolbarActivity(viewer, toolbar)
    } finally {
      URL.revokeObjectURL(url)
    }
  }, helper)

  const toolbar = page.locator("#toolbar")
  const viewer = page.locator("#viewer")
  await expect(toolbar).toBeVisible()
  await page.clock.fastForward(2999)
  await expect(toolbar).toBeVisible()
  await page.clock.fastForward(1)
  await expect(toolbar).toBeHidden()
  await expect(toolbar).toHaveAttribute("inert", "")
  await expect(toolbar).toHaveAttribute("aria-hidden", "true")

  for (const event of ["pointermove", "click", "touchstart"]) {
    await viewer.dispatchEvent(event)
    await expect(toolbar).toBeVisible()
    await expect(toolbar).not.toHaveAttribute("inert")
    await page.clock.fastForward(2000)
    await viewer.dispatchEvent(event)
    await page.clock.fastForward(2999)
    await expect(toolbar).toBeVisible()
    await page.clock.fastForward(1)
    await expect(toolbar).toBeHidden()
  }

  await viewer.dispatchEvent("pointerdown", { pointerId: 7 })
  await page.clock.fastForward(6000)
  await expect(toolbar).toBeVisible()
  await page.evaluate(() =>
    window.dispatchEvent(new PointerEvent("pointerup", { pointerId: 7 }))
  )
  await page.clock.fastForward(3000)
  await expect(toolbar).toBeHidden()

  await viewer.focus()
  await viewer.press("a")
  await page.locator("#control").focus()
  await expect(page.locator("#control")).toBeFocused()
  await page.clock.fastForward(6000)
  await expect(toolbar).toBeVisible()
  await page.locator("#outside").focus()
  await page.clock.fastForward(3000)
  await expect(toolbar).toBeHidden()

  await viewer.dispatchEvent("pointerdown", { pointerId: 8 })
  await page.locator("#control").focus()
  await page.evaluate(() =>
    window.dispatchEvent(new PointerEvent("pointerup", { pointerId: 8 }))
  )
  await page.clock.fastForward(3000)
  await expect(toolbar).toBeHidden()

  await page.evaluate(() => window.cleanupToolbarActivity())
  await viewer.dispatchEvent("pointermove")
  await expect(toolbar).toBeHidden()
})
