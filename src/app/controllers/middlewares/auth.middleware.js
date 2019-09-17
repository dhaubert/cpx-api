const firebase = require("firebase-admin");
const UserController = require('../../controllers/UserController');

class AuthMiddleware {
  constructor() {
    try {
      this._initialized = false;
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
      this._init();
    } catch (err) {
      console.log(
        `Please, provide GOOGLE_APPLICATION_CREDENTIALS as an enviroment variable (${err})`
      );
    }
  }

  _init() {
    if (!this._initialized) {
      const app = firebase.initializeApp({
        credential: firebase.credential.cert(this.serviceAccount),
        databaseURL: this.url
      });

      this._initialized = app.name != "undefined";

      console.log(
        `Firebase connection with project ${app.name} was stablished.`
      );
    }
  }

  async decodeFirebaseToken(req, res, next) {
    const token = req.token; //provided by express-bearer-token
    if (!token) {
      res.status(400).json({
        error: {
          message: `Specify a refreshToken header to be authenticated`
        }
      });
    }

    try {
      const user = await firebase
        .auth()
        .verifyIdToken(token);
      req.uid = user.uid;
      console.log('-user', user);
      // req.user = { display_name : user.uid } 
      req.firebaseUser = user;
      next();
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async fillRegisteredUser(req, res, next) {
    // req.user = { displayName : 'douglas' };
    UserController.uid = req.uid;
    const localUser = await UserController.get();
    console.log('localUser', localUser);
    req.user = localUser;
    console.log('userInfo', req.user, req.user.displayName)
    next();
    // busca usuario na base local
    //se nao encontrar, exibe que nao foi cadastrado e precisa de signin
    //se encontrar preenche req.user com as informações e vai para o proximo
  }

}

module.exports = new AuthMiddleware();
