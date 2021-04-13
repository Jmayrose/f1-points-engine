#!/usr/bin/env node
require("dotenv").config();
const express = require("express");
const app = express();

const getPoints = require("./points");
const getSeason = require("./season");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/test", (req, res, next) => {
  res.json({ title: "Success" });
});

app.use("/points", (req, res) => {
  getPoints(req, res);
});
app.use("/season", (req, res) => {
  getSeason(req, res);
});
app.use("/calculate", (req, res) => {
  calculate(req, res);
});

let http = require("http");

let port = process.env.BACKEND_PORT;
app.set("port", port);

let server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
}

// DB functions here, may need changes to play nicely with existing backend queries//

const raceDB = require('./raceDB')

app.use(function (req, res, next){
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accesss-Control-Allow-Headers');
  next();
});

app.get('/getrace', (req, res) => {
  raceDB.getRaces()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/createrace', (req, res) => {
  raceDB.createRaces(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.delete('/races/:id', (req, res) => {
  raceDB.deleteRaces(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
