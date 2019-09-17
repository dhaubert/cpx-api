const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const bearerToken = require("express-bearer-token");
const routes = require("./routes");

class App {
  constructor() {
    this.server = express();
    this.isDev = process.env.NODE_ENV != "production";
    this.server.use(cors());
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(bearerToken());
    this.server.use(express.json());
    this.server.use(logger('dev'));
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
