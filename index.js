"use strict";

const http = require('http');
const db = require('./db');
const routes = require('./routes');

const server = http.createServer(routes.checkUrlMethod);

server.listen(5500, 'localhost', () => console.log(`\nRunning Serever at http://localhost:5500/\n`));