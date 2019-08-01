const admin = require("firebase-admin");

class Database {
  constructor() {
    this.serviceAccount = require("../../google-key.json");
    this.url = "https://ww-w-data.firebaseio.com";
  }
  init(){
    admin.initializeApp({
      credential: admin.credential.cert(this.serviceAccount),
      databaseURL: this.url
    });
  }
  async readValue(username) {
    const db = admin.database();
    let ref = db.ref(`wallets/${username}`);
    let snapshot = await ref.once("value");
    return snapshot.val();
  }
}

module.exports = new Database();
