import type { Core } from "@strapi/strapi"

const registrationPath = "/auth/register-admin"

export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const pathname = ctx.path.endsWith("/") ? ctx.path.slice(0, -1) : ctx.path
    const registrationToken = ctx.query.registrationToken

    if (
      ctx.method !== "GET" ||
      !pathname.endsWith(registrationPath) ||
      (typeof registrationToken === "string" && registrationToken.length > 0)
    ) {
      return next()
    }

    const superAdmin = await strapi.db.query("admin::user").findOne({
      where: { roles: { code: "strapi-super-admin" } },
      select: ["id"],
    })

    if (!superAdmin) {
      return next()
    }

    const adminPath = pathname.slice(0, -registrationPath.length)

    return ctx.redirect(`${adminPath}/auth/login`)
  }
}
