const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const AppProcess = sequelize.define('app-process', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  image: Sequelize.STRING,
});

module.exports = AppProcess;
