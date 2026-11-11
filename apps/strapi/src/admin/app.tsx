import { setPluginConfig } from "@_sh/strapi-plugin-ckeditor"
import { Cloud } from "@strapi/icons"
import type { StrapiApp } from "@strapi/strapi/admin"

// eslint-disable-next-line import-x/order
import { cs } from "./cs"
import "@repo/design-system/styles.css"

// eslint-disable-next-line import-x/order
import { defaultCkEditorConfig, simpleCkEditorConfig } from "./ckeditor/configs"
import DataRevalidate from "./extensions/DataRevalidate"
import Hierarchy from "./extensions/Hierarchy"

const componentDeleteLabelPattern = /^(delete|smazat)(\s|$)/i

const ckEditorTheme = {
  common: `
    .ck {
      color-scheme: light;
      --ck-color-base-background: #ffffff;
      --ck-color-base-foreground: #ffffff;
      --ck-color-base-border: #d1d5db;
      --ck-color-base-text: #111827;
      --ck-color-text: #111827;
      --ck-color-toolbar-background: #ffffff;
      --ck-color-toolbar-border: #d1d5db;
      --ck-color-panel-background: #ffffff;
      --ck-color-panel-border: #d1d5db;
      --ck-color-button-default-background: #ffffff;
      --ck-color-button-default-hover-background: #f3f4f6;
      --ck-color-button-default-active-background: #e5e7eb;
      --ck-color-button-default-text: #111827;
      --ck-color-button-on-background: #e5e7eb;
      --ck-color-button-on-text: #111827;
      --ck-color-button-action-background: #024731;
      --ck-color-button-action-text: #ffffff;
      --ck-color-input-background: #ffffff;
      --ck-color-input-border: #d1d5db;
      --ck-color-input-text: #111827;
      --ck-color-focus-border: #024731;
      --ck-color-shadow: rgba(15, 23, 42, 0.12);
      --ck-color-content-text: #111827;
      --ck-color-content-bg: #ffffff;
      --ck-color-widget-blurred-border: #d1d5db;
      --ck-color-widget-hover-border: #024731;
    }
  `,
  light: `
    .ck,
    .ck .ck-editor__main,
    .ck .ck-content,
    .ck .ck-toolbar,
    .ck .ck-dropdown__panel,
    .ck .ck-balloon-panel {
      background: #ffffff;
      color: #111827;
    }
  `,
  dark: `
    .ck,
    .ck .ck-editor__main,
    .ck .ck-content,
    .ck .ck-toolbar,
    .ck .ck-dropdown__panel,
    .ck .ck-balloon-panel {
      background: #ffffff;
      color: #111827;
    }
  `,
}

function registerComponentDeleteConfirmation() {
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      const deleteButton = target.closest<HTMLElement>(
        "button, [role='button']"
      )
      const label =
        deleteButton?.getAttribute("aria-label") ??
        deleteButton?.getAttribute("title") ??
        deleteButton?.textContent?.trim()

      if (
        !deleteButton ||
        !label ||
        !componentDeleteLabelPattern.test(label) ||
        !deleteButton.querySelector(":scope svg")
      ) {
        return
      }

      if (!window.confirm("Are you sure you want to delete this component?")) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    },
    { capture: true }
  )
}

export default {
  config: {
    locales: ["en", "cs"],
    translations: {
      cs,
    },
  },
  async bootstrap(app: StrapiApp) {
    registerComponentDeleteConfirmation()

    app
      .getPlugin("content-manager")
      .injectComponent("editView", "right-links", {
        name: "Hierarchy",
        Component: Hierarchy,
      })

    app
      .getPlugin("content-manager")
      .injectComponent("editView", "right-links", {
        name: "DataRevalidate",
        Component: DataRevalidate,
      })

    const adminPanelConfigEnv = process.env.ADMIN_PANEL_CONFIG_API_AUTH_TOKEN
    if (adminPanelConfigEnv) {
      /**
       * Fetch admin panel config at runtime (e.g., theme settings)
       * and apply them to the admin panel.
       *
       * This can be used to inject CSS into the admin panel based on runtime env variables.
       * This is an example of usage, feel free to modify per your needs.
       */
      const configRequest = await fetch("/api/admin-panel-config", {
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_PANEL_CONFIG_API_AUTH_TOKEN}`,
        },
      })
      if (configRequest.ok) {
        const configData = await configRequest.json()

        // Set the variable to the window object so it can be accessed globally
        Object.defineProperty(globalThis, "ADMIN_PANEL_CONFIG", {
          value: configData,
          configurable: true,
          writable: true,
        })

        // Set data-theme attribute on document element so that we can potentially include CSS themes
        document.documentElement.dataset.theme =
          configData.APP_BRAND.toLowerCase()

        const colors =
          configData.APP_BRAND === "BRAND_A"
            ? { primary: "#123123", accent: "#234234" }
            : { primary: "#321321", accent: "#432432" }

        document.documentElement.style.setProperty(
          "--color-primary-default",
          colors.primary
        )
        document.documentElement.style.setProperty(
          "--color-accent-dark",
          colors.accent
        )
      } else {
        console.error(await configRequest.text())
      }
    }
  },
  register(app: StrapiApp) {
    app.widgets.register({
      icon: Cloud,
      title: {
        id: "cdn-cache.widget.title",
        defaultMessage: "CDN cache",
      },
      component: async () => {
        const component = await import("./widgets/CdnCacheWidget")

        return component.default
      },
      id: "cdn-cache",
    })

    setPluginConfig({
      presets: [defaultCkEditorConfig, simpleCkEditorConfig],
      theme: ckEditorTheme,
    })
  },
}
