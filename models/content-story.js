const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Story = sequelize.define('story', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  name: Sequelize.STRING,
  designation: Sequelize.STRING,
  text: Sequelize.STRING,
});

module.exports = Story;
