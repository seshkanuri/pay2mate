const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Signature = sequelize.define('signature', {
    signatureId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  signatureImage: {
    type: Sequelize.STRING,
    allowNull: false
  },

});

module.exports = Signature;
