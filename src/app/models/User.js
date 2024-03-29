const database = require("./database");
class User {
  constructor() {
    this.database = database;
  }

  async add({ displayName, uid, photoURL, slackUsername, balance, email }) {
    return await this.database.setValue(`users/${uid}/`, {
        displayName,
        uid,
        photoURL,
        email,
        slackUsername,
        wallet: { balance }
    });
  }

  async get({ uid }) {
    const userRef = uid? `/users/${uid}` : `/users/`;
    return await this.database.readValue(userRef);
  }
}

module.exports = new User();
