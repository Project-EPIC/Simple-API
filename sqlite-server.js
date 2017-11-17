'use strict';

var url = require('url');
var sqlite3 = require('sqlite3').verbose();

var today = new Date()
var todayString = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

var OVER_RIDE_NAME = '2017-11-07'

var MELISSA_STATIC_DB = '/home/mebi6705/Simple-API/daily_coded_tweet_db_files/' + OVER_RIDE_NAME + '.sqlite3'

//var db = new sqlite3.Database(MELISSA_STATIC_DB);

var TESTING_DB = "2017-11-16.sqlite3"

var db = new sqlite3.Database(TESTING_DB)

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

  console.log("WRITING TWEET TO DATABASE: " + payload.tweet + " BY: " + payload.user)

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

  console.log("REMOVING TWEET: "+payload.tweet +" by USER: "+payload.user + " DETAIL: "+payload.detail)

  db.run("DELETE FROM tweets WHERE tweet == ? AND user == ? AND detail == ?", payload.tweet, payload.user, payload.detail,
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
