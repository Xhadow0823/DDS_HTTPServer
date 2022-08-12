const { Sequelize } = require('sequelize');

/**
 * 獲得 NTP model
 */
module.exports = (db) => {
  return db.define('NTP', {
    NTPEnable: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    NTPHost: {
      type: Sequelize.STRING
    },
    TimeZone: {
      type: Sequelize.STRING
    }
  }, {
    // Other model options go here
  });
}