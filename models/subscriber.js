const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Subscriber = sequelize.define('subscriber', {
  subscriberId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isRead: Sequelize.BOOLEAN,
});

module.exports = Subscriber;
