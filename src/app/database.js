const admin = require("firebase-admin");

class Database {
  constructor() {
    // try {
      this.serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      this.url = process.env.FIREBASE_URL;
    // } catch (err) {
    //   console.log(`Please, provide GOOGLE_APPLICATION_CREDENTIALS as an enviroment variable (${err})`)
    // }
  }

  init() {
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

  async newPair(username, currentBalance) {
    //push
    //https://firebase.google.com/docs/database/admin/save-data?authuser=0
  }

  async update(username, currentBalance) {
    //set
    //transaction
    //https://firebase.google.com/docs/database/admin/save-data?authuser=0
  }


}

module.exports = new Database();
