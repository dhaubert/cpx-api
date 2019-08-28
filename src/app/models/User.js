const database = require("./database");
class User {
  constructor() {
    this.database = database;
  }

  async add({ full_name, uid, avatar, slack_username, balance }) {
    return await this.database.setValue(`users/${slack_username}/`, {
        full_name,
        uid,
        avatar,
        slack_username,
        wallet: { balance }
    });
  }

  async get({ uid }) {
    const userRef = uid? `/users/${uid}` : `/users/`;
    console.log('userRef:' , userRef);
    return await this.database.readValue(userRef);
  }
}

module.exports = new User();
