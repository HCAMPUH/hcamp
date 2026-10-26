/**
 * pledge router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/pledges/count",
      handler: "pledge.count",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/pledges/list",
      handler: "pledge.list",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/pledges/submit",
      handler: "pledge.submit",
      config: {
        auth: false,
      },
    },
  ],
}
