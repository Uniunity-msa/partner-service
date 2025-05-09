const mysql = require('mysql');

const pool = mysql.createPool({
    host: process.env.PARTNER_SERVICE_DB_HOST,
    port: process.env.PARTNER_SERVICE_DB_PORT,
    user: process.env.PARTNER_SERVICE_DB_USER,
    password: process.env.PARTNER_SERVICE_DB_PASSWORD,
    database: process.env.PARTNER_SERVICE_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = { pool };