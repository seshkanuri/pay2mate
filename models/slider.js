
const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Slider = sequelize.define('slider', {
  sliderId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  sliderImage: Sequelize.STRING,
});

module.exports = Slider;
