import type { PopulateOverrideEntries } from "@notum-cz/strapi-plugin-smart-populate/types"
import type { Modules, UID } from "@strapi/strapi"

type ComponentPopulateMap = {
  [TComponentUID in UID.Component]: Required<
    Modules.Documents.Params.Pick<TComponentUID, "populate:object">
  >["populate"]
}

const populateOverrides = [
  {
    componentUid: "utilities.link",
    mergeWithGeneratedPopulate: true,
    overridePopulate: {
      page: {
        fields: ["fullPath"],
      },
    },
  },
  {
    componentUid: "sections.post-list",
    mergeWithGeneratedPopulate: true,
    overridePopulate: {
      posts: {
        fields: [
          "title",
          "slug",
          "excerpt",
          "eventDate",
          "featured",
          "location",
          "eventTime",
          "eventSpeakers",
        ],
        populate: {
          coverImage: true,
        },
      },
    },
  },
  {
    componentUid: "sections.events-and-research",
    mergeWithGeneratedPopulate: true,
    overridePopulate: {
      events: {
        fields: [
          "title",
          "slug",
          "eventDate",
          "eventTime",
          "eventSpeakers",
          "location",
        ],
      },
      researchItems: {
        populate: {
          page: {
            fields: ["title", "fullPath"],
          },
        },
      },
    },
  },
] satisfies PopulateOverrideEntries<ComponentPopulateMap>

export function smartPopulateConfig() {
  return {
    enabled: true,
    config: {
      populateOverrides,
    },
  }
}
