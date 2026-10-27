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
      const all = ctx.query.all === "true" || ctx.query.all === true
      const total = await strapi.db.query("api::pledge.pledge").count()

      if (all) {
        const pledges = await strapi.documents("api::pledge.pledge").findMany({
          fields: ["firstName", "lastName", "schoolOrganization"],
          limit: Math.max(total, 1),
          sort: [{ createdAt: "desc" }],
        })

        ctx.body = {
          data: pledges,
          meta: { page: 1, pageSize: total, hasMore: false },
        }

        return
      }

      const requestedPage = Number(ctx.query.page)
      const requestedPageSize = Number(ctx.query.pageSize)
      const page =
        Number.isFinite(requestedPage) && requestedPage > 0
          ? Math.floor(requestedPage)
          : 1
      const pageSize =
        Number.isFinite(requestedPageSize) && requestedPageSize > 0
          ? Math.min(Math.floor(requestedPageSize), 12)
          : 12
      const pledges = await strapi.documents("api::pledge.pledge").findMany({
        fields: ["firstName", "lastName", "schoolOrganization"],
        limit: pageSize,
        start: (page - 1) * pageSize,
        sort: [{ createdAt: "desc" }],
      })
      ctx.body = {
        data: pledges,
        meta: {
          page,
          pageSize,
          hasMore: page * pageSize < total,
        },
      }
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

      const pledge = await strapi.documents("api::pledge.pledge").create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          schoolOrganization: schoolOrganization.trim(),
        },
      })

      ctx.body = { data: pledge }
    },
  })
)
