const firebase = require("../utils/firebase");
const User = require("./UserController");

class AuthController {
  constructor() {}

  async signin({ slackUsername, access_token }) {

    const userPayload = await this.getUserInfo({ access_token });
    const { uid, email, picture: photoURL, name: displayName } = userPayload;
    if (!userPayload) {
      throw { message: `User is not logged in on Google.`, statusCode: 401 };
    }

    if (!this.validateEmail(email)) {
      throw {
        message: `Email ${email} is not part of irriga.net`,
        statusCode: 403
      };
    }

    User.uid = userPayload.uid;
    const alreadyExists = await User.exists(userPayload);
    if (!alreadyExists) {
      User.add({
        uid,
        email,
        displayName,
        photoURL,
        // if slack username is not informed, searches for his username by email
        slackUsername
      });
    }

    const localUser = await User.get();
    return localUser;
  }

  validateEmail(email) {
    return (
      // /@irriga.net\s*$/.test(email) || /@sistemairriga.com.br\s*$/.test(email)
      /@irriga.net\s*$/.test(email)
    );
  }

  async auth({ access_token }) {
    return await this.getUid({ access_token });
  }

  async getUserInfo({ access_token }) {
    return await firebase.auth().verifyIdToken(access_token);
  }

  async getUid({ access_token }) {
    const user = await this.getUserInfo({ access_token });
    return user.uid || false;
  }

  createUser(user) {
    const additionalClams = {
      isAdmin: true
    };
    // await firebase.auth().setCustomUserClaims(user.uid, tokenClaims);
    // {
    //   "rules":
    //     "premiumContent": {
    //       ".read": "auth.token.premiumAccount === true"
    //     }
    // }

    return firebase.auth().setCustomUserClaims(user.uid, additionalClams);
  }
}

module.exports = new AuthController();
