import { calculateFlipbookLayout } from "react-pdf-flipbook-viewer/bundle/components/flipbook-viewer/flipbook/layout"
import { describe, expect, it } from "vitest"

describe("flipbook layout", () => {
  it("fits one upright page inside an iPhone portrait viewport", () => {
    const layout = calculateFlipbookLayout(393, 659, 840, 660, true, true)

    expect(layout.isSinglePage).toBe(true)
    expect(layout.width).toBeCloseTo(393)
    expect(layout.height).toBeLessThanOrEqual(659)
  })

  it("fits a two-page spread in an iPhone landscape viewport", () => {
    const layout = calculateFlipbookLayout(852, 393, 840, 660, true, false)

    expect(layout.isSinglePage).toBe(false)
    expect(layout.width).toBeLessThanOrEqual(852)
    expect(layout.height).toBeLessThanOrEqual(393)
  })

  it("fits a tall page and keeps narrow landscapes to one page", () => {
    const layout = calculateFlipbookLayout(568, 320, 600, 900, true, false)

    expect(layout.isSinglePage).toBe(true)
    expect(layout.width).toBeLessThanOrEqual(568)
    expect(layout.height).toBeCloseTo(320)
  })

  it("keeps the existing 768px breakpoint for other devices", () => {
    expect(
      calculateFlipbookLayout(767, 900, 840, 660, false, true).isSinglePage
    ).toBe(true)
    expect(
      calculateFlipbookLayout(768, 900, 840, 660, false, true).isSinglePage
    ).toBe(false)
  })
})
