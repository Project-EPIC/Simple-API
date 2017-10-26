'use strict';

var url = require('url');
var sqlite3 = require('sqlite3').verbose();

var todayString = new Date().toDateString().replace(/ /g,"_")

var db = new sqlite3.Database(todayString + '.sqlite3');
var myParser = require("body-parser");

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS tweets (tweet TEXT, value INTEGER, detail TEXT, user TEXT, timestamp TIMESTAMP)");
  db.run("CREATE TABLE IF NOT EXISTS meta (key TEXT, value INTEGER)");
  db.run("INSERT INTO meta(key,value) SELECT 'postAdd',0 WHERE NOT EXISTS(SELECT 1 FROM meta WHERE key = 'postAdd')")
  db.run("INSERT INTO meta(key,value) SELECT 'postDel',0 WHERE NOT EXISTS(SELECT 1 FROM meta WHERE key = 'postDel')")
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
  console.warn("GET Request to /sqlite")
  db.all("SELECT * FROM tweets ORDER BY timestamp DESC LIMIT 25", function(err, row) {
    if (err) throw err
    res.json(row)
  });
});

restapi.get('/sqlite-status', function(req, res){
  console.warn("GET Request to /sqlite-status")
  var tweets = []
  db.all("SELECT * FROM meta", function(err, row) {
    if (err) throw err
    res.json(row)
  });
});


restapi.get('/sqlite-tweets', function(req, res){
  console.warn("Returning Tweet List")


});

//Save a tweet ID
restapi.post('/sqlite', function(req, res){

  db.run("UPDATE meta SET value = value + 1 WHERE key = 'postAdd'", function(err, row){
    if (err) throw err;
  })

  var payload = req.body;

  console.log("WRITING TWEET TO DATABASE: " + payload.tweet)

  db.run("INSERT INTO tweets (tweet, value, detail, user, timestamp) VALUES (?,?,?,?,CURRENT_TIMESTAMP)",
    payload.tweet,
    payload.value,
    payload.detail,
    payload.user,
    function(err, row){
      if (err){
        console.error(err);
        res.status(500);
      }
      else {
        res.status(200);
      }
      res.end();
    }
  );
});

//Remove an existing tweet
restapi.post('/sqlite-remove', function(req, res){

  db.run("UPDATE meta SET value = value + 1 WHERE key = 'postDel'", function(err, row){
    if (err) throw err;
  })

  var payload = req.body;

  console.log("REMOVING TWEET: "+payload.tweet)

  db.run("DELETE FROM tweets WHERE tweet == ?", payload.tweet,
    function(err, row){
      if (err){
        console.error(err);
        res.status(500);
      }
      else {
        res.status(200);
        res.send("Removed Tweet: "+payload.tweet)
      }
      res.end();
    });
});

restapi.listen(4501);
