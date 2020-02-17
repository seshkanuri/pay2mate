const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Company = sequelize.define('company', {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  companyName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  EIN: {
    type: Sequelize.STRING,
    allowNull: false
  },
  hasPartner: Sequelize.BOOLEAN,
  partnerEmail: Sequelize.STRING,
  companyAddress: Sequelize.STRING,
  companyCity: Sequelize.STRING,
  companyZipCode: Sequelize.STRING,
  companyCountry: Sequelize.STRING,
  companyTelephone: Sequelize.STRING,
  partnerName: Sequelize.STRING,
  partnerMiddleName: Sequelize.STRING,
  partnerLastName: Sequelize.STRING,
  partnerDesignation:Sequelize.STRING,
});

module.exports = Company;
