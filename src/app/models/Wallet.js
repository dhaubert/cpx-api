class Wallet {
  constructor() {
    this.database = require('../database');
    this.database.init();
  }
  async currentBalance(username) {
    return await this.database.readValue(username);
  }

  store() {
    console.log('Making a cpx transaction');
    // const database = firebase.database();
    // const walletRef = database.ref();

    // walletRef.push('55');
  }
}

module.exports = new Wallet();
