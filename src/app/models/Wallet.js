const database = require("./database");

class Wallet {

  constructor() {
    this.database = database;
    //set, update, push, and transactions
    //https://firebase.google.com/docs/database/admin/save-data?authuser=0
  }

  async currentBalance(userHash) {
    return await this.database.readValue(`users/${userHash}/wallet/balance`);
  }

  async setBalance(userHash, newValue) {
    return await this.database.setValue(`users/${userHash}/wallet/balance`, newValue);
  }


  async transfer(usernameFrom, usernameTo, transferAmount) {
    const fromTransaction = await this.database.transaction(`/users/${usernameFrom}/wallet/balance`,
      currentMoneyFrom => {
        console.log('currentMoneyFrom', currentMoneyFrom);
        const newBalance = currentMoneyFrom - transferAmount;
        const notEnoughFunds = newBalance < 0;
        if (currentMoneyFrom === null) {
          return -1;
        } else if (notEnoughFunds) {
          return;
        }
        return newBalance;
      }
    );

    console.log(`Funds from ${usernameFrom} are now: `, fromTransaction.snapshot.val(), "->", fromTransaction.commited)

    if (fromTransaction.committed && (fromTransaction.snapshot.val() || fromTransaction.snapshot.val() === 0)) {
      const toTransaction = await this.database.transaction(
        `/users/${usernameTo}/wallet/balance`,
        currentMoneyTo => {
          if (currentMoneyTo === null) {
            currentMoneyTo = 0;
          }
          return currentMoneyTo + transferAmount;
        }
      );

      return toTransaction.committed && toTransaction.snapshot.val() > 0;
    }
    console.log('Not enough funds to transfer.');
    return false;
  }

}

module.exports = new Wallet();
