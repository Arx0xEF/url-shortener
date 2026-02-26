"use strict";

const http = require('http');
const db = require('./db');
const routes = require('./routes');

const server = http.createServer(routes.checkUrlMethod);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`\nRunning Serever at on PORT ${PORT}/\n`));