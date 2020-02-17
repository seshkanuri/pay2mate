const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Document = sequelize.define('document', {
    documentId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  documentName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  documentUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdDate: Sequelize.DATE,
});

module.exports = Document;
