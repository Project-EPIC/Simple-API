Simple API
==========

This repository contains two node severs to run a basic API to enable basic logging and database updates from simple http requests.

The two servers are:

1. server.js
1. sqlite-server.js

Code for interacting with the servers is included in `sample.html`

## 1. Basic Logging Server
The basic logging server just converts URL variables to JSON and writes them to `stdout`.

To start it:

    npm install
    node server.js > output.jsonl

Then any request you issue to port `4500` is written to `output.jsonl`. For example, any GET request to (such as entering this in your browser):

    http://localhost:4500/write&id=123

will write the following line to `output.jsonl`:

    {"id" : 123}

The subsequent request: `http://localhost:4500/write&id=456` will result in the contents of `output.jsonl`:

    {"id" : 123}
    {"id" : 456}

## 2. SQLite-Server
For a tad more control, there is a `POST` operation sqlite-backed server that can be run as:

    npm install
    node sqlite-server.js > log

(Still recommend saving the log)

This API has 4 endpoints:

1. `GET /sqlite`
1. `GET /sqlite-status`
1. `POST /sqlite`
1. `POST /sqlite-remove`

Currently based on `tweet`, an object of `{tweet:<id>}` `POST`ed to `/sqlite-remove` will delete it from the database.

Visiting `/sqlite` in the browser shows the last 25 tweets written to the database while `sqlite-status` gives an update of the number of `POST` requests.

Each time the server runs, it looks for (or creates) a sqlite file with the days date. Therefore, restarting the server daily ensures that data is made available.

If `POST` requests are successful, a success message is returned. `sample.html` uses this to change the button status.
