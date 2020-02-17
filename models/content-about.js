const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const About = sequelize.define('about', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  aboutText: Sequelize.TEXT,
});

module.exports = About;
