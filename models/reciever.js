const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Reciever = sequelize.define('reciever', {
  recieverId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  recieverName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  recieverEmail: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telephone: Sequelize.STRING,
  address: Sequelize.STRING,
  city: Sequelize.STRING,
  country: Sequelize.STRING,
  zipCode: Sequelize.STRING,
});

module.exports = Reciever;
