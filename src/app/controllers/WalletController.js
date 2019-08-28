const Wallet = require('../models/Wallet');
const TransactionController = require('./TransactionController');

class WalletController {
  constructor() {
    this.model = Wallet;
  }

  async read(req, res){
    // let username = 'tsenger';
    let username = req.params.username;
    let value = await this.model.currentBalance(username);
    console.log(value);
    res.send(`Your wallet has ${value} cupinxas.`);
  }

  async subBalance (username, amount) {
    let currentBalance = await this.model.currentBalance(username);
    let newAmount = currentBalance - amount;
    let balanceWasUpdated = await this.model.setBalance(username, newAmount);
    console.log('setBalance response', balanceWasUpdated);
    // res.send(ok? `5 cpx were deducted from ${username} wallet.`: `error deducting 5 cpx from ${username}`);
  }

  async addBalance (username, amount) {
    /**
      @todo substituir por transaction
    */
    let currentBalance = await this.model.currentBalance(username);
    let newAmount = currentBalance + amount;
    let balanceWasUpdated = await this.model.setBalance(username, newAmount);
    return balanceWasUpdated;
  }

  // async transfer (fromUsername, toUsername, amount) {
  //   this.subBalance(fromUsername, amount);
  //   this.addBalance(toUsername, amount);
  //   // @todo adicionar transaction em Wallet
  // }

  async transfer (fromUsername, toUsername, amount) {
    const success = await this.model.transfer(fromUsername, toUsername, amount);
    console.log('Transfer succeed? ', success? 'yes': 'no');
    if (success) {
      TransactionController.register(fromUsername, toUsername, amount);
    }
    return success;
  }
}

module.exports = new WalletController();
