"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // Create job with linked user
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.job = ctx.state.user.id;
      entity = await strapi.services.jobs.create(data, { files });
    } else {
      ctx.request.body.job = ctx.state.user.id;
      entity = await strapi.services.jobs.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.jobs });
  },

  // Update job
  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [jobs] = await strapi.services.jobs.find({
      id: ctx.params.id,
      "job.id": ctx.state.user.id,
    });

    if (!jobs) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.jobs.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.jobs.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.jobs });
  },

  // Delete job
  async delete(ctx) {
    const { id } = ctx.params;

    const [jobs] = await strapi.services.jobs.find({
      id: ctx.params.id,
      "job.id": ctx.state.user.id,
    });

    if (!jobs) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    const entity = await strapi.services.jobs.delete({ id });

    return sanitizeEntity(entity, { model: strapi.models.jobs });
  },

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
