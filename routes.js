"use strict";

const controller = require('./controllers');
async function checkUrlMethod(request, response) {
    console.log(request.url, request.method);
    const { url, method } = request;
    // console.log(`${req.url}`);
    // console.log(`${req.method}`)
    if(request.url === '/favicon.ico' || request.url.startsWith('//ws')) {
        response.writeHead(204);
        response.end();
        return;
    }
    else if(request.url === '/favicon.ico') {
        response.writeHead(204);
        response.end();
        return;
    }
    else if(request.method === "GET" && request.url === "/") {
        // html file retrieval
        controller.serverHome(request, response);
    }
    else if(request.method === "POST" && request.url === "/shorten") {
        // shorten  
        controller.shortenURL(request, response);
    }
    else if(request.method === "GET" && request.url !== "/") {
        // redirect to url

        controller.redirectURL(request, response);
    }
    else {
        response.writeHead(404, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ error: 'Not found'}));
    }
}

exports.checkUrlMethod = checkUrlMethod;