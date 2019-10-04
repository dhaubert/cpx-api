const express = require("express");

const routes = express.Router();

const UserController = require("../src/app/controllers/UserController");
const AuthController = require("../src/app/controllers/AuthController");
const TransactionController = require("../src/app/controllers/TransactionController");
const AuthMiddleware = require("../src/app/controllers/middlewares/auth.middleware");

routes.get(
  "/",
  AuthMiddleware.decodeFirebaseToken,
  AuthMiddleware.fillStoredUser,
  (req, res) => {
    const username = req.user ? req.user.displayName : "cupinxa";
    res.send(`Hello ${username}.`);
    // res.json(req.user);
  }
);

routes.get("/user/:uid", async (req, res) => {
  const user = await UserController.find(req.params);
  res.json(user);
});

routes.get("/user", async (req, res) => {
  const users = await UserController.find(req.body);
  res.json(users);
});

routes.post("/signin", async (req, res) => {
  try {
    if (await AuthController.signin(req.body)) {
      res.status(200).json({ message: `User is signed in.` });
    }
  } catch (error) {
    console.log("error", error);
    res.status(error.statusCode || 401).json(error);
  }
});

routes.get("/wallet/:uid", async (req, res) => {
  UserController.uid = req.params.uid;
  const wallet = await UserController.getWallet();
  res.json(wallet);
});

routes.get("/wallet",
  AuthMiddleware.decodeFirebaseToken,
  AuthMiddleware.fillStoredUser,
  async (req, res) => {
    UserController.uid = req.uid;
    const wallet = await UserController.getWallet();
    res.json(wallet);
});

routes.get("/wallet/:uid",
  AuthMiddleware.decodeFirebaseToken,
  AuthMiddleware.fillStoredUser,
  async (req, res) => {
    const { uid } = req.params;
    UserController.uid = uid;
    const wallet = await UserController.getWallet();
    res.json(wallet);
});

routes.get("/transaction", async (req, res) => {
  const transactions = await TransactionController.getAll();
  res.json(transactions);
});

routes.put(
  "/transfer",
  AuthMiddleware.decodeFirebaseToken,
  AuthMiddleware.fillStoredUser,
  async (req, res) => {
    const { to, amount } = req.body;
    UserController.uid = req.uid;

    try {
      const transactionSucceed = await UserController.transferTo({
        uidTo: to,
        amount
      });

      if (transactionSucceed) {
        res.status(200).send({
          message: `Transaction was registered from ${req.user.displayName} to ${to} of ${amount} cpx.`
        });
      }
    } catch (error) {
      res.status(error.statusCode).send({
        message: error.message
      });
    }
  }
);

module.exports = routes;
