const admin = require("firebase-admin");
/**
 * Implements an abstraction to firebase real time database
 */
class Database {
  constructor() {
    try {
      this._initialized = this._db = false;
      this.serviceAccount = {
        "type": "service_account",
        "project_id": process.env.GOOGLE_PROJECT_ID,
        "private_key_id": process.env.GOOGLE_PVT_KEY_ID,
        "private_key": process.env.GOOGLE_PVT_KEY,
        "client_email": process.env.GOOGLE_CLIENT_EMAIL,
        "client_id": process.env.GOOGLE_CLIENT_ID,
        "auth_uri": process.env.GOOGLE_AUTH_URI,
        "token_uri": process.env.GOOGLE_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.GOOGLE_AUTH_PROVIDER_URL,
        "client_x509_cert_url": process.env.GOOGLE_CLIENT_CERT_URL
      }

      this.url = process.env.FIREBASE_URL;
      this._init();
    } catch (err) {
      console.log(
        `Please, provide GOOGLE_APPLICATION_CREDENTIALS as an enviroment variable (${err})`
      );
    }
  }

  _init() {
    if (!this._initialized) {
      const app = admin.initializeApp({
        credential: admin.credential.cert(this.serviceAccount),
        databaseURL: this.url
      });

      this._initialized = app.name != "undefined";
      this._db = admin.database();

      console.log(`Firebase connect with project ${app.name} was stablished.`);
    }
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
