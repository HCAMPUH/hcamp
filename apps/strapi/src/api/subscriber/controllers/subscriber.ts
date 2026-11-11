/**
 * subscriber controller
 */

import { factories } from "@strapi/strapi"

import { logError } from "../../../utils/logging"

const escapeEmailText = (value: unknown, singleLine = false) => {
  const text = Array.from(String(value ?? ""), (character) =>
    character === "\r" ? "\n" : character
  )
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0

      return character === "\n" || (codePoint >= 32 && codePoint !== 127)
    })
    .join("")

  return singleLine ? text.replaceAll("\n", " ") : text
}

const isSafeReplyTo = (value: string) =>
  value.includes("@") && !value.includes(" ")

export default factories.createCoreController(
  "api::subscriber.subscriber",
  ({ strapi }) => ({
    async create(ctx) {
      const response = await super.create(ctx)
      const { name, email, message } = ctx.request.body.data

      if (message) {
        const safeName = escapeEmailText(name, true)
        const safeEmail = escapeEmailText(email, true)
        const safeMessage = escapeEmailText(message)
        const replyTo = isSafeReplyTo(safeEmail) ? safeEmail : undefined

        try {
          await strapi.plugins.email.services.email.send({
            to: strapi.config.get("plugin.email.settings.defaultFrom"),
            ...(replyTo && { replyTo }),
            subject: "New contact form message",
            text: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${safeMessage}`,
          })
        } catch (error) {
          logError(error, "Failed to send contact form email")
        }
      }

      return response
    },
  })
)
