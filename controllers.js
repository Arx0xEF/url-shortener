"use strict";

const crypto = require('crypto');
const db = require('./db');
const path = require('path');
const fs = require('fs');

function parseURL(urlq) {
    if(!urlq || typeof urlq !== "string")
        return false;

    if(!urlq.startsWith('http://') && !urlq.startsWith('https://')) {
        urlq = 'https://' + urlq;
    }

    try {
        new URL(urlq);
    } catch {
        return false;
    }

    return urlq;  // return fixed url
}

/*
if(!response.headersSent) {

        }
        */

async function serverHome(request, response) {
    let data;
    try {
        data = await fs.promises.readFile(path.join(__dirname, 'index.html'));
    }
    catch (err)  {
        console.error(`err: ${err}`);
        response.writeHead(500, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({error: 'Internal Server Error'}));
        return;
    }
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(data);
}


async function shortenURL(request, response) {
    // console.log('shortenurl HIT');
    let data = [];
    request.on("data", (chunk) => {
        data.push(chunk);
    });
    request.on("error", (error) => {
        console.error("Stream error: ", error);
        if(!response.headersSent) {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({'error': "Request stream error"}));
            return;
        }
    });
    request.on('end', async function () {
        try {
            // read data chnks into an array
            let buff_byte;
            let orig_url;
            try {
                buff_byte = JSON.parse(Buffer.concat(data).toString());
                orig_url = buff_byte.url;
//                console.log(`HELLO HELLO ${orig_url}`);
            }
            catch(err) {
                console.error(`Invalid JSON ${err}`);
                response.writeHead(400, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({error: "Invalid JSON"}));
                return;
            }
            // getting the url from the clients request
            if(!parseURL(orig_url)) {
                response.writeHead(400, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({error: "Invalid URL"}));
                return;
            }
            // creating a short code
            const shortCode = crypto.randomBytes(4).toString('hex');
            // inserting query text using parameterized values
            const text = 'INSERT INTO urls(orig_url, short_code) VALUES ($1, $2) RETURNING *';
            const values = [orig_url, shortCode];
            // console.log(`orig_url ${orig_url}, short_code: ${shortCode}`);
            let db_query;
            try {
                db_query = await db.query(text, values);
            }
            catch (err) {
                console.error('Error Occurred', err);
                throw err;
            }
            // console.error("inserted rows: ", db_query.rows);
            // send an http response header to the client
            response.writeHead(201, { 'Content-Type': 'application/json' });
            console.log(request.headers.host);
            response.end(JSON.stringify({short_url: `https://${request.headers.host}/${shortCode}`}));
        }
        catch (error) {
            console.error("Server Eror: ", error);
            if(!response.headersSent){
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({error: 'Internal Server Error'}));
            }
        }
    });
}

/*
So Now Your redirectURL Flow Is:E
Extract short code
Query urls table
If not found → 404
Insert into clicks table
Redirect
Order matters.
*/

async function redirectURL(request, response) {
    const shortenPath = request.url.slice(1);
    // console.log("request url: ", request.url);

    const text = 'SELECT orig_url FROM urls WHERE short_code = $1';
    const value = [shortenPath];
    // console.log("shtoendn",shortenPath);
    const result = await db.query(text, value);
    //console.log("SELECT rows: ", result, " length: ", result.rows.length);
    if(result.rows.length === 0) {
        response.writeHead(404, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({error: 'Short URL not found'}));
        return;
    }
    const text2 = 'INSERT INTO clicks (short_code, ip_addr) VALUES ($1, $2) RETURNING *';
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const value2 = [shortenPath, ip];
    const log_click = await db.query(text2, value2)

    let orig_url = result.rows[0].orig_url;
    orig_url = 'https://' + orig_url;
    // console.log("originalurl:", orig_url);

    response.writeHead(302, { 'Location': orig_url });
    response.end();
    // response.end(JSON.stringify({redirect: `${orig_url}`}));
}


exports.shortenURL = shortenURL;
exports.redirectURL = redirectURL;
exports.serverHome = serverHome;
