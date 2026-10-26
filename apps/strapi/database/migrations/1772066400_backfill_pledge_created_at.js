"use strict"

module.exports = {
  async up(knex) {
    await knex("pledges")
      .whereNull("created_at")
      .update({ created_at: new Date() })
  },

  async down() {
    // Existing creation dates are intentionally not cleared on rollback.
  },
}
