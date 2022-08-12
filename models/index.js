const db = require('./db');

module.exports = {
  /** 資料庫模型 */
  db: db,
  /** NTP 資料表模型 */
  NTP: require('./NTP')(db)
}