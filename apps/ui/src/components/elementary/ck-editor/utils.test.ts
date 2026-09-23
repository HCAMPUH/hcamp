import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/navigation", () => ({
  routing: { locales: ["en", "cs"] },
}))

import {
  removeEmptyImagesFromContent,
  transformOembedElements,
} from "@/components/elementary/ck-editor/utils"

describe("transformOembedElements", () => {
  it("renders YouTube embeds as privacy-enhanced iframes", () => {
    const result = transformOembedElements(
      '<figure class="media"><oembed url="https://www.youtube.com/watch?v=abc123"></oembed></figure>'
    )

    expect(result).toContain(
      '<iframe src="https://www.youtube-nocookie.com/embed/abc123"'
    )
    expect(result).not.toContain("<oembed")
  })

  it("supports Vimeo and leaves unsupported providers unchanged", () => {
    expect(
      transformOembedElements(
        '<oembed url="https://vimeo.com/123456"></oembed>'
      )
    ).toContain('src="https://player.vimeo.com/video/123456"')

    const unsupported = '<oembed url="https://example.com/video"></oembed>'
    expect(transformOembedElements(unsupported)).toBe(unsupported)
  })

  it("does not allow unsafe embed URLs", () => {
    const content = '<oembed url="javascript:alert(1)"></oembed>'

    expect(transformOembedElements(content)).toBe(content)
  })
})

describe("removeEmptyImagesFromContent", () => {
  it("removes images without a usable source", () => {
    expect(removeEmptyImagesFromContent('<img src="">')).toBe("")
  })
})
