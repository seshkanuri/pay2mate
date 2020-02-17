const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const CheckImage = sequelize.define('check_Image', {
    checkImageId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  checkFront: Sequelize.STRING,
  checkBack: Sequelize.STRING
});

module.exports = CheckImage;
