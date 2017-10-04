'use strict';

const http = require('http');
var url = require('url');


//var fs = require("fs")
//var output = fs.createWriteStream('data')

http.createServer((request, response) => {

  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Request-Method', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  response.setHeader('Access-Control-Allow-Headers', '*');

  request.on('error', (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });

  if (request.method === 'GET'){
    var urlParts = url.parse(request.url, true);
    console.error("GET")
    if (urlParts.pathname === '/write'){
      console.error("Writing JSON object of length: "+Object.keys(urlParts.query).length)
      console.log(JSON.stringify(urlParts.query))
    }
    response.end();

  } else {
    response.statusCode = 404;
    response.end();
  }
}).listen(4500);
