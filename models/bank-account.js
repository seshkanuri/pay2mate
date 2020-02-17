const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const BankAccount = sequelize.define('bank_account', {
  bankAccountId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  accountNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isSubAccount: Sequelize.BOOLEAN,
  subAccountNumber: Sequelize.STRING,
  address: Sequelize.STRING,
  accountName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  individualAccount: Sequelize.BOOLEAN,
  isIndividualCoPartner: Sequelize.BOOLEAN,

});

module.exports = BankAccount;
