"use strict";

const http = require('http');
const db = require('./db');
const routes = require('./routes');
 // const process = require('dotenv').config();

const server = http.createServer(routes.checkUrlMethod);

const PORT = process.env.PORT || 3000;
///const PORT = process.env.PORT;

// console.log(process.env.PORT);

server.listen( PORT, () => console.log(`\nRunning Serever at on PORT ${PORT}\n`));
