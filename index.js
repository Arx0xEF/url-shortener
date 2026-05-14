"use strict";

const http = require('http');
const db = require('./db');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;
const server = http.createServer(routes.checkUrlMethod);
server.listen( PORT, () => console.log(`\nRunning Serever at on PORT ${PORT}\n`));