const {  DataTypes } = require('sequelize');

/**
 * 獲得 topic model
 */
module.exports = (db) => {
  return db.define('topic', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.DOUBLE
    }
  }, {
    // Other model options go here
  });
}