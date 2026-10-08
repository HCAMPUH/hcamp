import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/navigation", () => ({
  routing: { locales: ["en", "cs"] },
}))

import {
  removeEmptyImagesFromContent,
  transformOembedElements,
} from "@/components/elementary/ck-editor/utils"

describe("transformOembedElements", () => {
  it("renders YouTube embeds as thumbnail play buttons", () => {
    const result = transformOembedElements(
      '<figure class="media"><oembed url="https://www.youtube.com/watch?v=abc123"></oembed></figure>'
    )

    expect(result).toContain('class="ck-video-placeholder"')
    expect(result).toContain(
      'data-video-embed="https://www.youtube-nocookie.com/embed/abc123"'
    )
    expect(result).toContain('src="/api/youtube-thumbnail?video=abc123"')
    expect(result).toContain(
      "this.src='https://i.ytimg.com/vi/abc123/hqdefault.jpg'"
    )
    expect(result).not.toContain("<oembed")
  })

  it("supports Vimeo and leaves unsupported providers unchanged", () => {
    expect(
      transformOembedElements(
        '<oembed url="https://vimeo.com/123456"></oembed>'
      )
    ).toContain('data-video-embed="https://player.vimeo.com/video/123456"')
    expect(
      transformOembedElements(
        '<oembed url="https://vimeo.com/123456"></oembed>'
      )
    ).toContain('src="/api/vimeo-thumbnail?video=123456"')
    expect(
      transformOembedElements(
        '<oembed url="https://vimeo.com/123456"></oembed>'
      )
    ).toContain("this.src='/images/placeholder.png'")

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
