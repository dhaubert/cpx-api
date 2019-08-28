const express = require("express");

const routes = express.Router();

const TransactionController = require("../src/app/controllers/TransactionController");
const UserController = require("../src/app/controllers/UserController");
const WalletController = require("../src/app/controllers/WalletController");

routes.get("/", (req, res) => {
  res.send("Hello cupinxa.");
});

routes.put("/transfer", async (req, res) => {
  const { from, to, amount } = req.body;
  const transactionSucceed = await WalletController.transfer(from, to, amount)
  res.send(`Transaction |${transactionSucceed}| was registered from ${from} to ${to} of ${amount} cpx.`)
});

routes.post("/user", async (req, res) => {
  const userId = await UserController.add(req.body);
  res.send(`User ${userId} was registered successfully.`);
});

module.exports = routes;
