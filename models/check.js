const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Check = sequelize.define('check', {
  checkId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  checkNumber: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  issuedDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  amount: {
    type: Sequelize.STRING,
    allowNull: false
  },
  checkMemo: Sequelize.STRING,
  isSignCompleted: Sequelize.BOOLEAN,
  isRecieverSignCompleted: Sequelize.BOOLEAN,
  senderOnBhalfSign: Sequelize.BOOLEAN,
  senderPartnerSignDate: Sequelize.DATE,
  isRecieved: Sequelize.BOOLEAN,
  recieveDate: Sequelize.DATE,
  checkStatus: {
    type: Sequelize.ENUM,
    values: ['pending', 'recieved'],
    defaultValue: 'pending'
  },
  createdDate: Sequelize.DATE,


});

module.exports = Check;
