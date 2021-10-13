"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // Get logged in users
  async me(ctx) {
    const user = ctx.state.user;

    // Get user by token
    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    // Gets a user specific job
    const data = await strapi.services.jobs.find({ job: user.id });

    if (!data) {
      return ctx.notFound();
    }

    return sanitizeEntity(data, { model: strapi.models.jobs });
  },
};
