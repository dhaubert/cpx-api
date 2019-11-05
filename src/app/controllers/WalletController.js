const Wallet = require('../models/Wallet');
const TransactionController = require('./TransactionController');
const slack = require('../utils/slack');
const UserController = require('../controllers/UserController');

class WalletController {
  constructor() {
    this.model = Wallet;
  }

  async get({ uid }){
    return await this.model.get(uid);
  }

  async transfer ({ uidFrom, uidTo, amount, message }) {
    amount = amount.toFixed(2);
    console.log(`Transfering ${amount} cpx from ${uidFrom} to ${uidTo}.`)
    const success = await this.model.transfer(uidFrom, uidTo, amount);
    console.log('Transfer succeed? ', success? 'yes': 'no');
    if (success) {
      this.notify({ uidFrom, uidTo, amount, message });
      TransactionController.register({ uidFrom, uidTo, amount });
    }
    return success;
  }

  async notify({ uidFrom, uidTo, amount, message }) {
    const UserController = require('../controllers/UserController');
    const fromUser = await UserController.find({ uid: uidFrom });
    const toUser = await UserController.find({ uid: uidTo });
    return await slack.postOnChannel({ from: fromUser.slackUsername, to: toUser.slackUsername, amount, message });
  }
}

module.exports = new WalletController();
