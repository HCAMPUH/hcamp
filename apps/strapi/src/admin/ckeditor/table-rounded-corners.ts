import {
  FormRowView,
  Plugin,
  SwitchButtonView,
  TablePropertyCommand,
  TablePropertiesUI,
} from "ckeditor5"

const roundedCornersAttribute = "tableRoundedCorners"
const roundedCornersClass = "table-rounded"

export class RoundedTablePropertiesPlugin extends Plugin {
  static get requires() {
    return [TablePropertiesUI]
  }

  init() {
    const editor = this.editor
    const tablePropertiesUI = editor.plugins.get(
      TablePropertiesUI
    ) as TablePropertiesUI & {
      _createPropertiesView: (defaults: Record<string, unknown>) => {
        locale: typeof editor.locale
        children: { add: (view: unknown, index: number) => void }
      }
    }

    editor.model.schema.extend("table", {
      allowAttributes: [roundedCornersAttribute],
    })
    editor.model.schema.setAttributeProperties(roundedCornersAttribute, {
      isFormatting: true,
    })

    editor.conversion.for("upcast").elementToAttribute({
      view: {
        name: /^(figure|table)$/,
        classes: roundedCornersClass,
      },
      model: {
        key: roundedCornersAttribute,
        value: true,
      },
    })

    editor.conversion.for("downcast").add((dispatcher) => {
      dispatcher.on(
        `attribute:${roundedCornersAttribute}:table`,
        (event, data, conversionApi) => {
          if (!conversionApi.consumable.consume(data.item, event.name)) {
            return
          }

          const figure = conversionApi.mapper.toViewElement(data.item)
          if (!figure) {
            return
          }

          if (data.attributeNewValue) {
            conversionApi.writer.addClass(roundedCornersClass, figure)
          } else {
            conversionApi.writer.removeClass(roundedCornersClass, figure)
          }
        }
      )
    })

    editor.conversion.for("dataDowncast").attributeToAttribute({
      model: {
        key: roundedCornersAttribute,
        values: [true],
      },
      view: {
        key: "class",
        value: roundedCornersClass,
      },
    })

    editor.commands.add(
      roundedCornersAttribute,
      new TablePropertyCommand(editor, roundedCornersAttribute, undefined)
    )

    const createPropertiesView =
      tablePropertiesUI._createPropertiesView.bind(tablePropertiesUI)

    tablePropertiesUI._createPropertiesView = (defaults) => {
      const view = createPropertiesView(defaults)
      const roundedCornersButton = new SwitchButtonView(view.locale)

      roundedCornersButton.set({
        label: "Rounded corners",
        tooltip: true,
        withText: true,
      })
      view.children.add(
        new FormRowView(view.locale, {
          children: [roundedCornersButton],
          class: "ck-table-form__rounded-corners-row",
        }),
        3
      )
      roundedCornersButton
        .bind("isOn")
        .to(editor.commands.get(roundedCornersAttribute), "value")
      roundedCornersButton.on("execute", () => {
        const command = editor.commands.get(roundedCornersAttribute)
        editor.execute(roundedCornersAttribute, {
          value: !command.value,
        })
      })

      return view
    }
  }
}
