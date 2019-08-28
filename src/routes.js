const express = require("express");

const routes = express.Router();

const TransactionController = require("../src/app/controllers/TransactionController");
const UserController = require("../src/app/controllers/UserController");
const WalletController = require("../src/app/controllers/WalletController");

routes.get("/", (req, res) => {
  res.send("Hello cupinxa.");
});

routes.get("/user/:uid", async (req, res) => {
  const user = await UserController.get(req.params);
  res.send(user);
});

routes.get("/user/", async (req, res) => {
  const users = await UserController.get(req.body);
  res.send(users);
});

routes.post("/user", async (req, res) => {
  const userId = await UserController.add(req.body);
  res.send({ message: `User ${userId} was registered successfully.`, error: false }, 201);
});

routes.put("/transfer", async (req, res) => {
  const { from, to, amount } = req.body;
  const transactionSucceed = await WalletController.transfer(from, to, amount)
  res.send(`Transaction |${transactionSucceed}| was registered from ${from} to ${to} of ${amount} cpx.`)
});

module.exports = routes;
