const { Sequelize } = require("sequelize");

const dotenv = require("dotenv");
dotenv.config();

const database = process.env.db_database || 'DDS';
const user = process.env.db_user || 'root';
const pw = process.env.db_pw || 'password';
const host = process.env.db_host || 'localhost';
const port = process.env.db_port || 3306;

const db = new Sequelize(database, user, pw, {
  host: host,
  dialect: 'mariadb',
  dialectOptions: {  // mariadb connector option
    connectTimeout: 1000,
    port: port
  }
});

module.exports = db;