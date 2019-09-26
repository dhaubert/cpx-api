const Transaction = require('../models/Transaction');

class TransactionController {

  constructor() {
    this.model = Transaction;
  }

  async register ({ uidFrom, uidTo, amount }) {
    return this.model.add(uidFrom, uidTo, amount);
  }

  async getAll() {
    return this.model.read();
  }

  async get(username) {
    return this.model.read(username);
  }
}

module.exports = new TransactionController();
