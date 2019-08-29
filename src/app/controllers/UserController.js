const User = require("../models/User");
const WalletController = require("./WalletController");
class UserController {
  constructor() {
    this.wallet = WalletController;
    this.model = User;
    this.initialBalance = 50;
    this.uid;
  }

  async add(user) {
    // @todo bind slack username here
    const newUser = { balance: this.initialBalance, ...user };
    return await this.model.add(newUser);
  }

  /**
   * Get one or all users
   * @param {object} [optional] { uid } User Identifier
   * @returns {object}
   */
  async get({ uid }) {
    return this.model.get({ uid });
  }

  async transferTo({ uidTo, amount }) {
    if (!this.uid) {
      return { message: 'You must set a uid for this user.', error: 404 };
    }
    return await WalletController.transfer({ uidFrom: this.uid, uidTo, amount });
  }

  async getWallet() {
    if (!this.uid) {
      return { message: 'You must set a uid for this user.' };
    }
    return await WalletController.get({ uid: this.uid });
  }

}

module.exports = new UserController();
