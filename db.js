"use strict";

const pg = require('pg');
// reading env variable from .env file
// console.log(`DB_HOST: ${process.env.DB_HOST}`);
const env = require('dotenv');
env.config();
/*
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
*/
// console.log(`DB_USER: ${process.env.DB_PASSWORD}`);

// client pool for resuable pool of clients 
const { Pool } = pg;
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// database connection test 
async function testConnection() {
    const conntest = await db.query('SELECT * FROM urls LIMIT 1');
    console.log(conntest.rows[0]);
}
// testConnection();

module.exports = db;