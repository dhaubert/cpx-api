const Wallet = require('../models/Wallet');
const TransactionController = require('./TransactionController');

class WalletController {
  constructor() {
    this.model = Wallet;
  }

  async get({ uid }){
    return await this.model.get(uid);
  }

  async transfer ({ uidFrom, uidTo, amount }) {
    const success = await this.model.transfer(uidFrom, uidTo, amount);
    console.log('Transfer succeed? ', success? 'yes': 'no');
    if (success) {
      TransactionController.register(uidFrom, uidTo, amount);
    }
    return success;
  }
}

module.exports = new WalletController();
