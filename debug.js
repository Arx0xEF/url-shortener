"use strict";

const {url} = require('node:url');
const orig_url = "http://localhost:5500/"
let urlq = new URL(orig_url);


if(!(["http:", "https:"].includes(urlq.protocol))) {
    console.log("No it deosnt has http: or https:");
}
else {
    console.log("Yes it has http: or https:");
}