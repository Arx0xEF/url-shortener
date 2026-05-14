"use strict";

const pg = require('pg');
// reading env variable from .env file
// console.log(`DB_HOST: ${process.env.DB_HOST}`);
const env = require('dotenv');
env.config();

console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);

// client pool for resuable pool of clients
const { Pool } = pg;
//console.log(`database_url: ${process.env.DATABASE_URL}`);
const db = new Pool({
host: 'localhost',
  port: '5432',
  database: 'url_shortener',
  user: 'postgres',
  password: 'Hwdd27j3d6is',
    ssl: { rejectUnauthorized: false }
});

module.exports = db;
