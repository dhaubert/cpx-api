const firebase = require("../utils/firebase");
/**
 * Implements an abstraction to firebase real time database
 */
class Database {
  constructor() {
    this._db = firebase.database();
  }

  async readValue(reference) {
    const ref = this._db.ref(`${reference}`);
    let snapshot = await ref.once("value");
    return snapshot? snapshot.val() : false;
  }

  async setAtomicValue(reference, updateFunction) {
    const upvotesRef = this._db.ref(`${reference}`);
    upvotesRef.transaction(updateFunction);
  }

  async pushValue(reference, newValue) {
    return this._db.ref(`${reference}`).push(newValue);
  }

  async setValue(reference, newValue) {
    return this._db.ref(`${reference}`).set(newValue);
  }

  async updateValue(reference, newValue) {
    return this._db.ref(`${reference}`).push(newValue);
  }

  async transaction(reference, callback) {
    return this._db.ref(reference).transaction(callback);
  }

}

module.exports = new Database();
