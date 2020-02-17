const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Policy = sequelize.define('policy', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  policyText: Sequelize.TEXT
});

module.exports = Policy;
