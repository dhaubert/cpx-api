const express = require("express");

const routes = express.Router();

const UserController = require("../src/app/controllers/UserController");
const AuthController = require("../src/app/controllers/AuthController");
const TransactionController = require("../src/app/controllers/TransactionController");

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

routes.get("/signin", async (req, res) => {
  try {
    if ( await AuthController.signin(req.body) ){
      res.status(200).send({ message: `User is signed in.` });
    }
  } catch (error) {
    console.log('error', error);
    res.status(error.statusCode).send(error.message);
  }
});


routes.get("/wallet/:uid", async (req, res) => {
  UserController.uid = req.params.uid;
  const wallet = await UserController.getWallet();
  res.send(wallet);
});

routes.get("/transactions", async (req, res) => {
  const transactions = await TransactionController.getAll();
  res.send(transactions);
});

routes.put("/transfer", async (req, res) => {
  const { from, to, amount } = req.body;
  UserController.uid = from;
  const transactionSucceed = await UserController.transferTo({
    uidTo: to,
    amount
  });
  res
    .status(200)
    .send(
      {
        message: `Transaction |${transactionSucceed}| was registered from ${from} to ${to} of ${amount} cpx.`
      },
      200
    );
});

module.exports = routes;
