const firebase = require('../../utils/firebase');
const UserController = require('../../controllers/UserController');

class AuthMiddleware {
  constructor() {
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
          message: `Specify a Bearer toekn in order to be authenticated`
        }
      });
    }

    try {
      const user = await firebase
        .auth()
        .verifyIdToken(token);
      req.uid = user.uid;
      req.firebaseUser = user;
      next();
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async fillStoredUser(req, res, next) {
    // req.user = { displayName : 'douglas' };
    UserController.uid = req.uid;
    const localUser = await UserController.get();
    req.user = localUser;
    next();
  }

}

module.exports = new AuthMiddleware();
