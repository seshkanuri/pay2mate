
const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const KycType = sequelize.define('kyc_type', {
  kycTypeId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  kycType: Sequelize.STRING,
  kycTypeDescription: Sequelize.STRING,
});



module.exports = KycType;
