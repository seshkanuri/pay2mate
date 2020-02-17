const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Term = sequelize.define('term', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  termText: Sequelize.TEXT
});

module.exports = Term;
