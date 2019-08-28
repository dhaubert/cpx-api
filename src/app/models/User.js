const database = require("./database");
class User {
  constructor() {
    this.db = database;
  }

  async add({ full_name, uid, avatar, slack_username, balance }) {
    return await this.db.setValue(`users/${slack_username}/`, {
        full_name,
        uid,
        avatar,
        slack_username,
        wallet: { balance }
    });
  }
}

module.exports = new User();
