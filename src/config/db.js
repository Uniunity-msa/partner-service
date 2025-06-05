const mysql = require('mysql2');
require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.PARTNER_SERVICE_DB_HOST,
  user: process.env.PARTNER_SERVICE_DB_USER,
  password: process.env.PARTNER_SERVICE_DB_PASSWORD,
  database: process.env.PARTNER_SERVICE_DB_DATABASE,
  port: process.env.PARTNER_SERVICE_DB_PORT,
  charset: 'utf8mb4'
});

module.exports = { pool };