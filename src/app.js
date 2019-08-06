const express = require("express");
const logger = require("morgan");
const routes = require("./routes");

class App {
  constructor() {
    this.server = express();
    this.isDev = process.env.NODE_ENV != "production";

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(logger('dev'));
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
