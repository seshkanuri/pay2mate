const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Bank = sequelize.define('bank', {
  bankId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  bankName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  routingNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: Sequelize.STRING,
  address: Sequelize.STRING,
  zipCode: Sequelize.STRING,
  telephone: Sequelize.STRING,
});

module.exports = Bank;
