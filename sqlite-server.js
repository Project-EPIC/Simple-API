'use strict';

var url = require('url');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('file.sqlite3');
var myParser = require("body-parser");

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS tweets (tweet TEXT, value INTEGER, detail TEXT, timestamp TIMESTAMP)");
  db.run("CREATE TABLE IF NOT EXISTS meta (key TEXT, value INTEGER)");
  db.run("INSERT INTO meta VALUES (?,?)","get_counter",0)
  db.run("INSERT INTO meta VALUES (?,?)","post_counter",0)
});

var express = require('express');
var restapi = express();

//https://gist.github.com/dalelane/6ce08b52d5cca8f92926
restapi.use(myParser.urlencoded({extended : true}));
restapi.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


restapi.get('/sqlite', function(req, res){
  console.warn("GET Request")

  db.get("SELECT key, value FROM meta WHERE key='get_counter'", function(err, row){
    res.json({ "Total Get Requests" : row.value });
  });
});

restapi.get('/sqlite-tweets', function(req, res){
  console.warn("Returning Tweet List")

  db.run("UPDATE meta SET value = value + 1 WHERE key = 'get_counter'", function(err, row){
    if (err) throw err;
  })

  db.each("SELECT * FROM tweets LIMIT 10000", function(err, row) {
    console.log(row);
  });
});


restapi.post('/sqlite', function(req, res){

  db.run("UPDATE meta SET value = value + 1 WHERE key = 'post_counter'", function(err, row){
    if (err) throw err;
  })

  var payload = req.body;

  console.log(payload)

  db.run("INSERT INTO tweets (tweet, value, detail, timestamp) VALUES (?,?,?,?)",
    payload.tweet,
    payload.value,
    payload.detail,
    new Date(),
    function(err, row){
      if (err){
        console.error(err);
        res.status(500);
      }
      else {
        res.status(200);
      }
      res.end();
    });
});

restapi.listen(4501);
