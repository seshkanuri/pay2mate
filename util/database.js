const Sequelize = require('sequelize');
const config = require('./config/dbConfig')[process.env.NODE_ENV || "development"];



const sequelize = new Sequelize(config.database,config.user, config.password, {
  dialect: 'mysql',
  host: config.host,
  define: {
      timestamps: false
  }
});

module.exports = sequelize;
