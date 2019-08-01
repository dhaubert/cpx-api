const Wallet = require('../models/Wallet');

class WalletController {
  constructor() {

  }
  async read(req, res){
    // let username = 'tsenger';
    let username = req.params.username;
    let value = await Wallet.currentBalance(username);
    console.log(value);
    res.send(`Your wallet has ${value} cupinxas.`);
  }
}

module.exports = new WalletController();
