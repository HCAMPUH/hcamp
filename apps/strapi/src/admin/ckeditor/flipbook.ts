import { ButtonView, Plugin, Widget, WidgetResize, toWidget } from "ckeditor5"
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist"

GlobalWorkerOptions.workerPort = new Worker(
  // Keep the worker same-origin so the admin CSP does not require a CDN.
  // eslint-disable-next-line unicorn/relative-url-style
  new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
  { type: "module" }
)

const flipBookIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M4.5 5.5h6a2 2 0 0 1 2 2v11a2 2 0 0 0-2-2h-6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm15 0h-6a2 2 0 0 0-2 2v11a2 2 0 0 1 2-2h6a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1Z"/>
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.7" d="M7 9h3M7 12h3M17 9h-3M17 12h-3"/>
  </svg>
`

const defaultFlipbookWidth = "100%"

const renderThumbnail = async (container: HTMLElement, pdfUrl: string) => {
  try {
    const pdf = await getDocument(pdfUrl).promise
    const page = await pdf.getPage(1)
    const baseViewport = page.getViewport({ scale: 1 })
    const scale = Math.min(900 / baseViewport.width, 1)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = viewport.width
    canvas.height = viewport.height
    canvas.setAttribute("aria-hidden", "true")
    container.replaceChildren(canvas)

    await page.render({ canvasContext: context, viewport }).promise
  } catch {
    container.textContent = "PDF preview unavailable"
  }
}

export class FlipBookPlugin extends Plugin {
  static get requires() {
    return [Widget, WidgetResize]
  }

  init() {
    const editor = this.editor

    editor.model.schema.register("flipbook", {
      inheritAllFrom: "$blockObject",
      allowAttributes: ["pdf", "width"],
    })

    editor.conversion.for("upcast").elementToElement({
      view: {
        name: "figure",
        classes: "flipbook",
      },
      model: (viewElement, { writer }) => {
        // CKEditor view elements expose attributes, not DOM dataset properties.
        // eslint-disable-next-line unicorn/dom-node-dataset
        const pdf = viewElement?.getAttribute("data-flipbook-pdf")
        if (typeof pdf !== "string" || pdf.length === 0) return null

        return writer.createElement("flipbook", {
          pdf,
          width:
            viewElement
              .getAttribute("style")
              ?.match(/width:\s*([^;]+)/i)?.[1] ?? defaultFlipbookWidth,
        })
      },
    })

    editor.conversion.for("dataDowncast").elementToElement({
      model: "flipbook",
      view: (modelElement, { writer }) =>
        writer.createContainerElement("figure", {
          class: "flipbook",
          "data-flipbook-pdf": modelElement.getAttribute("pdf"),
          style: `width: ${modelElement.getAttribute("width") ?? defaultFlipbookWidth}`,
        }),
    })

    editor.conversion.for("dataDowncast").attributeToAttribute({
      model: {
        name: "flipbook",
        key: "width",
      },
      view: {
        key: "style",
        value: (width) => `width: ${width}`,
      },
    })

    editor.conversion.for("editingDowncast").elementToElement({
      model: "flipbook",
      view: (modelElement, { writer }) => {
        const pdf = modelElement.getAttribute("pdf")
        const width = modelElement.getAttribute("width") ?? defaultFlipbookWidth
        const figure = writer.createContainerElement("figure", {
          class: "flipbook ck-flipbook-widget",
          style: `width: ${width}`,
        })
        const preview = writer.createRawElement(
          "div",
          { class: "ck-flipbook-preview" },
          (domElement) => {
            domElement.setAttribute("aria-label", "PDF first page preview")
            renderThumbnail(domElement, String(pdf))
          }
        )

        writer.insert(writer.createPositionAt(figure, 0), preview)

        return toWidget(figure, writer, {
          label: "PDF FlipBook",
        })
      },
    })

    editor.conversion.for("editingDowncast").attributeToAttribute({
      model: {
        name: "flipbook",
        key: "width",
      },
      view: {
        key: "style",
        value: (width) => `width: ${width}`,
      },
    })

    editor.conversion.for("editingDowncast").add((dispatcher) => {
      dispatcher.on("insert:flipbook", (event, data, conversionApi) => {
        const viewElement = conversionApi.mapper.toViewElement(data.item)
        if (!viewElement) return

        const domConverter = editor.editing.view.domConverter
        const resizer = editor.plugins.get(WidgetResize).attachTo({
          editor,
          modelElement: data.item,
          viewElement,
          unit: "%",
          onCommit: (newWidth) => {
            editor.model.change((writer) => {
              writer.setAttribute("width", `${newWidth}%`, data.item)
            })
          },
          getResizeHost: () => domConverter.mapViewToDom(viewElement),
          getHandleHost: () => domConverter.mapViewToDom(viewElement),
        })

        resizer.bind("isEnabled").to(editor.plugins.get(WidgetResize))
      })
    })

    const mediaLibrary = () => editor.plugins.get("StrapiMediaLib")
    let selectingPdf = false
    let dataBeforeSelection = ""
    let selectionPath: number[] | undefined
    let processingSelection = false

    const processSelectedPdf = () => {
      if (!selectingPdf || processingSelection) return

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
      editor.setData(dataBeforeSelection)

      editor.model.change((writer) => {
        const root = editor.model.document.getRoot()
        const insertionPosition = selectionPath
          ? editor.model.createPositionFromPath(root, selectionPath)
          : editor.model.document.selection.getFirstPosition()
        const flipbook = writer.createElement("flipbook", {
          pdf: selectedPdf.href,
          width: defaultFlipbookWidth,
        })
        editor.model.insertContent(flipbook, insertionPosition)
        writer.setSelection(flipbook, "on")
      })

      selectionPath = undefined
      editor.editing.view.focus()
      processingSelection = false
    }

    editor.model.document.on("change:data", () => {
      if (!selectingPdf) return
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
        selectionPath = [
          ...editor.model.document.selection.getFirstPosition().path,
        ]
        mediaLibrary().toggle()
      })

      return button
    })
  }
}
