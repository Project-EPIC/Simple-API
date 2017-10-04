'use strict';

const http = require('http');
var url = require('url');


//var fs = require("fs")
//var output = fs.createWriteStream('data')

http.createServer((request, response) => {

  request.on('error', (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on('error', (err) => {
    console.error(err);
  });
  if (request.method === 'GET'){
    var urlParts = url.parse(request.url, true);

    console.error("GET")

    if (urlParts.pathname === '/write'){
      console.error("Writing JSON object of length: "+Object.keys(urlParts.query).length)
      console.log(JSON.stringify(urlParts.query))
    }

  } else {
    response.statusCode = 404;
    response.end();
  }
}).listen(4500);
