const database = require("./database");

class Wallet {

  constructor() {
    this.database = database;
    //set, update, push, and transactions
    //https://firebase.google.com/docs/database/admin/save-data?authuser=0
  }

  async get(uid) {
    return await this.database.readValue(`users/${uid}/wallet`);
  }

  async currentBalance(uid) {
    return await this.database.readValue(`users/${uid}/wallet/balance`);
  }

  async setBalance(uid, newValue) {
    return await this.database.setValue(`users/${uid}/wallet/balance`, newValue);
  }

  async transfer(uidFrom, uidTo, transferAmount) {
    const fromTransaction = await this.database.transaction(`/users/${uidFrom}/wallet/balance`,
      currentMoneyFrom => {
        const newBalance = Number(currentMoneyFrom) - Number(transferAmount);
        const notEnoughFunds = newBalance < 0;
        if (currentMoneyFrom === null) {
          return 0;
        } else if (notEnoughFunds) {
          return;
        }
        return newBalance;
      }
    );

    console.log(`Funds from ${uidFrom} are now: `, fromTransaction.snapshot.val())

    if (fromTransaction.committed && (fromTransaction.snapshot.val() || fromTransaction.snapshot.val() === 0)) {
      const toTransaction = await this.database.transaction(
        `/users/${uidTo}/wallet/balance`,
        currentMoneyTo => {
          if (currentMoneyTo === null) {
            currentMoneyTo = 0;
          }
          return Number(currentMoneyTo) + Number(transferAmount);
        }
      );

      return toTransaction.committed && toTransaction.snapshot.val() > 0;
    }
    console.log('Not enough funds to transfer.');
    return false;
  }

}

module.exports = new Wallet();
