const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const IndividualCoPartner = sequelize.define('individual_copartner', {
  coPartnerId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },

  coPartnerName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  middleName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  partnerEmail: Sequelize.STRING,
  telephone : Sequelize.STRING,
  partnerAddress: Sequelize.STRING,

});

module.exports = IndividualCoPartner;
