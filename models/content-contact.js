const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ContactContent = sequelize.define('contact_content', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  icon: Sequelize.STRING,
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  link: Sequelize.STRING,
  linkText: Sequelize.STRING,
});

module.exports = ContactContent;
