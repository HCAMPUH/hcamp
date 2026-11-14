import { readFile } from "node:fs/promises"
import path from "node:path"

import { expect, test } from "@playwright/test"

const root = path.resolve(__dirname, "../../../..")
const bundles = [
  "packages/page-flip/bundle/js/page-flip.browser.js",
  "packages/page-flip/bundle/js/page-flip.module.js",
]

type Flipbook = {
  flipNext: () => void
  flipPrev: () => void
  getState: () => string
  getCurrentPageIndex: () => number
  loadFromHTML: (pages: HTMLElement[]) => void
}

declare global {
  interface Window {
    St: { PageFlip: new (element: HTMLElement, options: object) => Flipbook }
    flipbook: Flipbook
  }
}

function expectHardFaces(
  frames: { angle: number; visibility: string }[],
  isSafari: boolean
) {
  expect(frames.length).toBeGreaterThan(4)
  if (isSafari) {
    expect(frames.some((frame) => frame.visibility === "hidden")).toBe(true)
    expect(frames.some((frame) => frame.visibility === "visible")).toBe(true)
  }
  for (const frame of frames) {
    const faceVisibility =
      Math.cos((frame.angle * Math.PI) / 180) < 0 ? "hidden" : "visible"
    expect(frame.visibility).toBe(isSafari ? faceVisibility : "")
  }
}

for (const bundle of bundles) {
  for (const isSafari of [true, false]) {
    test(`hard-cover faces use ${isSafari ? "Safari" : "default"} rendering: ${path.basename(bundle)}`, async ({
      page,
    }) => {
      await page.setContent(`
      <style>
        .stf__wrapper { position: relative; width: 100%; }
        .page { background: white; }
      </style>
      <div id="book" style="width: 800px; height: 500px">
        <div class="page">Cover</div><div class="page">Page 2</div>
        <div class="page">Page 3</div><div class="page">Page 4</div>
        <div class="page">Page 5</div><div class="page">Back cover</div>
      </div>
    `)

      await page.evaluate((safari) => {
        Object.defineProperty(navigator, "userAgent", {
          configurable: true,
          value: safari
            ? "Mozilla/5.0 Version/17.0 Safari/605.1.15"
            : "Mozilla/5.0 Chrome/130.0 Safari/537.36",
        })
      }, isSafari)

      const source = await readFile(path.join(root, bundle), "utf8")
      if (bundle.endsWith(".module.js")) {
        await page.evaluate(async (code) => {
          const url = URL.createObjectURL(
            new Blob([code], { type: "text/javascript" })
          )
          try {
            // The UMD bundle exposes the same constructor on window.St.
            // eslint-disable-next-line unicorn/no-global-object-property-assignment
            window.St = await import(url)
          } finally {
            URL.revokeObjectURL(url)
          }
        }, source)
      } else {
        await page.addScriptTag({ content: source })
      }

      await page.evaluate(() => {
        const book = document.querySelector<HTMLElement>("#book")!
        const pages = Array.from(
          book.querySelectorAll<HTMLElement>(":scope .page")
        )
        // Expose the instance to the animation sampler in the browser context.
        // eslint-disable-next-line unicorn/no-global-object-property-assignment
        window.flipbook = new window.St.PageFlip(book, {
          width: 400,
          height: 500,
          size: "fixed",
          showCover: true,
          flippingTime: 1200,
          drawShadow: false,
          showPageCorners: false,
        })
        window.flipbook.loadFromHTML(pages)
      })

      const flip = async (direction: "next" | "previous") =>
        page.evaluate(
          (flipDirection) =>
            new Promise<{
              frames: { angle: number; visibility: string }[]
              index: number
            }>((resolve, reject) => {
              const frames: { angle: number; visibility: string }[] = []
              const startedAt = performance.now()
              const collect = () => {
                for (const element of document.querySelectorAll<HTMLElement>(
                  ".stf__item"
                )) {
                  const match = element.style.transform.match(
                    /rotateY\((-?[\d.]+)deg\)/
                  )
                  if (match) {
                    frames.push({
                      angle: Number(match[1]),
                      visibility: element.style.visibility,
                    })
                  }
                }
                if (window.flipbook.getState() === "read") {
                  resolve({
                    frames,
                    index: window.flipbook.getCurrentPageIndex(),
                  })
                } else if (performance.now() - startedAt > 5000) {
                  reject(new Error("Flip animation did not finish"))
                } else {
                  requestAnimationFrame(collect)
                }
              }
              if (flipDirection === "next") window.flipbook.flipNext()
              else window.flipbook.flipPrev()
              requestAnimationFrame(collect)
            }),
          direction
        )

      for (const [direction, expectedIndex] of [
        ["next", 1],
        ["previous", 0],
        ["next", 1],
        ["next", 3],
        ["next", 5],
        ["previous", 3],
      ] as const) {
        const result = await flip(direction)
        expect(result.index).toBe(expectedIndex)
        if (expectedIndex === 3 && direction === "next") {
          expect(result.frames).toHaveLength(0)
          continue
        }
        expectHardFaces(result.frames, isSafari)
      }

      await expect
        .poll(() =>
          page
            .locator(".stf__item")
            .first()
            .evaluate((element) => {
              return getComputedStyle(element).visibility
            })
        )
        .toBe("visible")
    })
  }
}
