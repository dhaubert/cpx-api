const User = require("../models/User");
const WalletController = require("./WalletController");
class UserController {
  constructor() {
    this.wallet = WalletController;
    this.model = require("../models/User");
    this.initialBalance = 50;
  }

  async add(user) {
    let newUser = { balance: this.initialBalance, ...user };
    return await this.model.add(newUser);
  }

  async transferTo(username, amount) {

  }

  async get({ uid }) {
    return this.model.get({ uid });
  }

}

module.exports = new UserController();
