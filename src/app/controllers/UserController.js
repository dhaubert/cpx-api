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
    this.uid = user.uid;
    const slackUsername = user.slackUsername || (await this.getSlackUser(user)).id;
    const newUser = { balance: this.initialBalance, ...user, slackUsername };
    return await this.model.add(newUser);
  }

  async getSlackUser ({ email }) {
    const slack = require("../utils/slack");
    const slackUser = await slack.getSlackUserFromEmail({ email });
    return slackUser || {};
  }

  /**
   * Get one or all users
   * @param {object} [optional] { uid } User Identifier
   * @returns {object}
   */
  async find({ uid }) {
    return this.model.get({ uid });
  }

  /**
   * Get information of the current user
   * @param {object} [optional] { uid } User Identifier
   * @returns {object}
   */
  async get() {
    return this.find(this);
  }

  async transferTo({ uidTo, amount }) {
    if (!this.uid) {
      throw { message: "You must set a uid for this user.", statusCode: 404 };
    }
    const receiverExists = await this.exists({ uid: uidTo });
    console.log("Receiver exists?", receiverExists);

    if (!receiverExists) {
      throw {
        message: "The receiving account was not found.",
        statusCode: 404
      };
    }

    const transferSucceed = await WalletController.transfer({
      uidFrom: this.uid,
      uidTo,
      amount
    });

    if (!transferSucceed) {
      throw { message: "Not enough funds.", statusCode: 402 };
    }
    return transferSucceed;
  }
  /**
   * Get user's wallet
   */
  async getWallet() {
    if (!this.uid) {
      return { message: "You must set a uid for this user.", statusCode: 404 };
    }
    return await WalletController.get({ uid: this.uid });
  }

  /**
   * Checks wether a user exists
   * @param {Object} uid Identifier of the user
   */
  async exists({ uid }) {
    uid = uid || this.uid;
    const user = await this.find({ uid });
    return user ? true : false;
  }
}

module.exports = new UserController();
