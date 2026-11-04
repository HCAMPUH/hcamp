import { ButtonView, Plugin } from "ckeditor5"

const flipBookIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M4.5 5.5h6a2 2 0 0 1 2 2v11a2 2 0 0 0-2-2h-6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm15 0h-6a2 2 0 0 0-2 2v11a2 2 0 0 1 2-2h6a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1Z"/>
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.7" d="M7 9h3M7 12h3M17 9h-3M17 12h-3"/>
  </svg>
`

const escapeAttribute = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")

export class FlipBookPlugin extends Plugin {
  init() {
    const { editor } = this
    let selectingPdf = false
    let dataBeforeSelection = ""
    let isRestoring = false
    let processingSelection = false

    const mediaLibrary = () => editor.plugins.get("StrapiMediaLib")

    const processSelectedPdf = () => {
      if (!selectingPdf || isRestoring || processingSelection) return

      const currentData = editor.getData()
      if (currentData === dataBeforeSelection) return

      const parser = new DOMParser()
      const currentDocument = parser.parseFromString(currentData, "text/html")
      const previousDocument = parser.parseFromString(
        dataBeforeSelection,
        "text/html"
      )
      const previousLinks = new Set(
        Array.from(
          previousDocument.body.querySelectorAll(":scope a"),
          (link) => link.href
        )
      )
      const selectedPdf = Array.from(
        currentDocument.body.querySelectorAll(":scope a[href]")
      ).find((link) => !previousLinks.has(link.href))

      if (!selectedPdf?.href) return

      processingSelection = true
      selectingPdf = false
      isRestoring = true
      editor.setData(dataBeforeSelection)
      isRestoring = false
      const flipBookHtml = `<figure class="flipbook" data-flipbook-pdf="${escapeAttribute(selectedPdf.href)}"><button type="button" class="ck-flipbook-placeholder" data-flipbook-pdf="${escapeAttribute(selectedPdf.href)}" aria-label="Open FlipBook"><span class="ck-flipbook-placeholder__label">Open PDF FlipBook</span></button></figure>`
      const viewFragment = editor.data.processor.toView(flipBookHtml)
      const modelFragment = editor.data.toModel(viewFragment)

      editor.model.insertContent(modelFragment)
      editor.editing.view.focus()
      processingSelection = false
    }

    editor.model.document.on("change:data", () => {
      if (!selectingPdf || isRestoring) return

      // The media-library plugin inserts its model fragment during the same
      // change cycle. Read the serialized HTML after that cycle completes.
      window.setTimeout(processSelectedPdf, 0)
    })

    editor.ui.componentFactory.add("insertFlipBook", (locale) => {
      const button = new ButtonView(locale)

      button.set({
        label: "Insert PDF FlipBook",
        icon: flipBookIcon,
        tooltip: true,
      })

      button.on("execute", () => {
        selectingPdf = true
        dataBeforeSelection = editor.getData()
        mediaLibrary().toggle()
      })

      return button
    })
  }
}
