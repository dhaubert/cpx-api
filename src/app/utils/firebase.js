const admin = require("firebase-admin");

class FirebaseProvider {
  constructor() {
    try {
      this.initialized = false;
      this.serviceAccount = {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PVT_KEY.replace(/\\n/g, '\n'),
        private_key: process.env.GOOGLE_PVT_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL
      };

      this.url = process.env.FIREBASE_URL;
      this.firebase = admin;
      this.init();
    } catch (err) {
      console.log(
        `An error happened while initializing firebase: (${err})`
      );
    }
  }

  init() {
    if (!this.initialized) {
      const app = this.firebase.initializeApp({
        credential: this.firebase.credential.cert(this.serviceAccount),
        databaseURL: this.url
      });

      this.initialized = app.name != "undefined";

      console.log(
        `Firebase connection with project ${app.name} was stablished.`
      );
    }
  }

  loadEnv() {
    this.serviceAccount = {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PVT_KEY,
      private_key: process.env.GOOGLE_PVT_KEY,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI,
      token_uri: process.env.GOOGLE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_URL,
      client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL
    };

    this.url = process.env.FIREBASE_URL;
  }
}

module.exports = new FirebaseProvider().firebase;
