const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Faq = sequelize.define('faq', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  question: Sequelize.STRING,
  answer: Sequelize.STRING,
});

module.exports = Faq;
