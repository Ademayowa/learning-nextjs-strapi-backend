const slugify = require("slugify");

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.company) {
        data.slug = slugify(data.company, { lower: true });
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.company) {
        data.slug = slugify(data.company, { lower: true });
      }
    },
  },
};
