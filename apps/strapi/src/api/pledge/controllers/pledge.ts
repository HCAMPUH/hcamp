/**
 * pledge controller
 */

import { factories } from "@strapi/strapi"

export default factories.createCoreController(
  "api::pledge.pledge",
  ({ strapi }) => ({
    async count(ctx) {
      const count = await strapi.db.query("api::pledge.pledge").count()

      ctx.body = { data: { count } }
    },

    async list(ctx) {
      const pledges = await strapi.documents("api::pledge.pledge").findMany({
        fields: ["firstName", "lastName", "schoolOrganization"],
        sort: [{ submittedAt: "desc" }],
      })

      ctx.body = { data: pledges }
    },

    async submit(ctx) {
      const input = ctx.request.body?.data
      const firstName = input?.firstName
      const lastName = input?.lastName
      const schoolOrganization = input?.schoolOrganization

      if (
        typeof firstName !== "string" ||
        typeof lastName !== "string" ||
        typeof schoolOrganization !== "string" ||
        !firstName.trim() ||
        !lastName.trim() ||
        !schoolOrganization.trim()
      ) {
        return ctx.badRequest(
          "First name, last name, and school/organization are required."
        )
      }

      const now = new Date()
      const pledge = await strapi.documents("api::pledge.pledge").create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          schoolOrganization: schoolOrganization.trim(),
          submittedAt: now.toISOString(),
        },
      })

      ctx.body = { data: pledge }
    },
  })
)
