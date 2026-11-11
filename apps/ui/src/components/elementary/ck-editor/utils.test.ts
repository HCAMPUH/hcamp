import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/navigation", () => ({
  routing: { locales: ["en", "cs"] },
}))

vi.mock("@/lib/strapi-helpers", () => ({
  formatStrapiMediaUrl: (url: string) => url,
}))

import {
  removeEmptyImagesFromContent,
  transformFlipbookElements,
  transformOembedElements,
} from "@/components/elementary/ck-editor/utils"

describe("transformFlipbookElements", () => {
  it("renders existing PDF flipbook objects as viewer mount points", () => {
    const result = transformFlipbookElements(
      '<figure class="flipbook" data-flipbook-pdf="https://example.com/report.pdf"><button>Open PDF FlipBook</button></figure>'
    )

    expect(result).toContain('class="ck-flipbook-renderer"')
    expect(result).toContain(
      'data-flipbook-pdf="https://example.com/report.pdf"'
    )
    expect(result).not.toContain("<button>")
  })

  it("leaves unsafe or unsupported PDF URLs unchanged", () => {
    const unsafe =
      '<figure class="flipbook" data-flipbook-pdf="javascript:alert(1)">PDF</figure>'

    expect(transformFlipbookElements(unsafe)).toBe(unsafe)
  })

  it("converts legacy PDF flipbook links into viewer mount points", () => {
    const result = transformFlipbookElements(
      '<a href="https://example.com/report.pdf">Open PDF FlipBook</a>'
    )

    expect(result).toContain('<figure class="flipbook"')
    expect(result).toContain(
      'data-flipbook-pdf="https://example.com/report.pdf"'
    )
    expect(result).toContain('class="ck-flipbook-renderer"')
    expect(result).not.toContain("<a ")
  })

  it("leaves ordinary PDF links unchanged", () => {
    const link = '<a href="https://example.com/report.pdf">Download PDF</a>'

    expect(transformFlipbookElements(link)).toBe(link)
  })
})

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
    expect(result).toContain('alt="" aria-hidden="true" role="presentation"')
    expect(result).not.toContain("title=")
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
