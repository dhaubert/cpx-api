const express = require("express");
const logger = require("morgan");

class App {
  constructor() {
    this.express = express();
    this.isDev = process.env.NODE_ENV != "production";

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(logger('dev'));
  }

  routes() {
    this.express.use(require("./routes"));
  }
}

module.exports = new App().express;
