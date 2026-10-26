"use strict"

module.exports = {
  async up(knex) {
    const hasColumn = await knex.schema.hasColumn("pledges", "submitted_at")

    if (hasColumn) {
      await knex.schema.alterTable("pledges", (table) => {
        table.dropColumn("submitted_at")
      })
    }
  },

  async down() {
    // The submittedAt field was intentionally removed and cannot be restored
    // without recreating historical timestamps.
  },
}
