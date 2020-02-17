const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const AccountType = sequelize.define('bankaccount_type', {
  bankAccountTypeId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  bankaccountType: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = AccountType;
