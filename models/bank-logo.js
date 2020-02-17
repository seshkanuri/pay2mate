const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const BankLogo = sequelize.define('bank_logo', {
  bankLogoId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  bankLogo: Sequelize.STRING,
});

module.exports = BankLogo;
