const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Contact = sequelize.define('contact', {
  contactId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message: Sequelize.STRING,
  phone: Sequelize.STRING,
  country: Sequelize.STRING,
  terms: Sequelize.BOOLEAN,
  isRead: Sequelize.BOOLEAN,
});

module.exports = Contact;
