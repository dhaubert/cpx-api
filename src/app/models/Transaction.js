class Transaction {
  constructor() {
    this.database = require("./database");
  }

  /**
   *
   * @param  {string} fromUsername
   * @param  {string} toUsername
   * @param  {float} amount
   */
  async add(fromUsername, toUsername, amount) {
    const { key } = await this.database.pushValue("transactions", {
      time: new Date().getTime(),
      from: fromUsername,
      to: toUsername,
      amount
    });
    return key;
  }

  async readFrom(username) {

  }

  async read(username) {
    this.database.readValue("transactions");
  }
}

module.exports = new Transaction();
