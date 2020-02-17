
const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const KYC = sequelize.define('kyc', {
  kycId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  document: Sequelize.STRING,
  deleted: Sequelize.BOOLEAN,
});

module.exports = KYC;
