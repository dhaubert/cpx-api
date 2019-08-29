const express = require("express");

const routes = express.Router();

const UserController = require("../src/app/controllers/UserController");
// const AuthController = require("../src/app/controllers/AuthController");

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

// -- Work in progress --
//routes.get("/signin", async (req, res) => {
//   const userId = await AuthController.auth();
//   res.send({ message: `User ${userId} was registered successfully.` }, 201);
// });

// routes.post("/user", async (req, res) => {
//   const userId = await UserController.add(req.body);
//   res.send({ message: `User ${userId} was registered successfully.` }, 201);
// });

routes.get("/wallet/:uid", async(req, res)  => {
  UserController.uid = req.params.uid;
  const wallet = await UserController.getWallet();
  res.send(wallet);
});

routes.put("/transfer", async (req, res) => {
  const { from, to, amount } = req.body;
  UserController.uid = from;
  const transactionSucceed = await UserController.transferTo({ uidTo: to, amount })
  res.status(200).send({ message: `Transaction |${transactionSucceed}| was registered from ${from} to ${to} of ${amount} cpx.` }, 200)
});

module.exports = routes;
