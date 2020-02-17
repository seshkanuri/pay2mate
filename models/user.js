const Sequelize = require("sequelize");

const sequelize = require("../util/database");


const User = sequelize.define('user', {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  uniqueName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  registerTime: Sequelize.DATE,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  phone: Sequelize.STRING,
  countryCode: Sequelize.STRING,
  state: Sequelize.STRING,
  city: Sequelize.STRING,
  zipCode: Sequelize.STRING,
  country: Sequelize.STRING,
  addressNumber: Sequelize.STRING,
  address: Sequelize.STRING,
  profileImageUrl: Sequelize.STRING,
  documentImageurl: Sequelize.STRING,
  resetToken: Sequelize.STRING,
  resetTokenExpire: Sequelize.STRING,
  isVerified: Sequelize.BOOLEAN,
  onBehalfSignature: Sequelize.BOOLEAN, // user is allowed to second sign on behalf or Not
  rejectReason: Sequelize.STRING,
  trustedUser: Sequelize.BOOLEAN,
  kycStatus: {
    type: Sequelize.ENUM,
    values: ['none', 'pending', 'completed'],
    defaultValue: 'none'
  },
  accountStatus: {
    type: Sequelize.ENUM,
    values: ['active', 'suspend'],
    defaultValue: 'active'
  },
  isAdmin: Sequelize.BOOLEAN
});

module.exports = User;
