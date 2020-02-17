const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const CheckBackground = sequelize.define('check_BackGround', {
    checkBackgroundId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  Image: Sequelize.STRING,
  uploadedByAdmin: Sequelize.BOOLEAN // defaults image that upload by admin
});

module.exports = CheckBackground;
