const Transaction = require('../models/Transaction');

class TransactionController {

  constructor() {
    this.model = Transaction;
  }

  async register (fromUsername, toUsername, amount) {
    return this.model.add(fromUsername, toUsername, amount);
  }

  async getAll() {
    return this.model.read();
  }

  async get(username) {
    return this.model.read(username);
  }
}

module.exports = new TransactionController();
