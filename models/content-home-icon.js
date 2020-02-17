const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const HomeIcon = sequelize.define('home_icon', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  text: Sequelize.STRING,
  icon: Sequelize.STRING,
  description: Sequelize.STRING
});

module.exports = HomeIcon;
