const db = require('../models').db;

/**
 * 資料庫同步 middleware
 */
module.exports.DBSync = (req, res, next) => {
  db.sync().then(() => next());
};

/**
 * @deprecated
 */
module.exports.DBAuthTest = (req, res, next) => {
  db.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    req.DBAuthSuccess = true;
  }).catch((err) => {
    console.error('Unable to connect to the database:', err);
    req.DBAuthSuccess = false;
    throw new Error('Unable to connect to the database');
  }).finally(() => next());
};