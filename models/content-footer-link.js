const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const FooterLink = sequelize.define('footer_link', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  name: Sequelize.STRING,
  link: Sequelize.STRING,
  icon: Sequelize.STRING,
});

module.exports = FooterLink;
