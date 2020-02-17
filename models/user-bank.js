const Sequelize = require("sequelize");

const sequelize = require("../util/database");


const UserBank = sequelize.define('user_bank', {

  bankNickName: Sequelize.STRING

});

module.exports = UserBank;
