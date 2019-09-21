const firebase = require("../utils/firebase");
const User = require("./UserController");

class AuthController {
  constructor() {}

  async signin({ uid, email, displayName, providerId, phoneNumber, photoURL, slackUsername, access_token }) {
    // checks the information received

    if (!this.validateEmail(email)){
      throw { message: `Email ${email} is not part of irriga.net or sistemairriga.com.br.`, statusCode: 403 };
    }

    const userPayload = await this.getUid({ access_token });
    if (!userPayload){
      throw { message: `User is not logged in on Google.`, statusCode: 401 };
    }

    // if the user doesn't exist, create a new one
    User.uid = uid;
    const alreadyExists = await User.exists({ uid });

    if (!alreadyExists) {
      User.add({
        uid,
        email,
        displayName,
        providerId,
        phoneNumber,
        photoURL,
        // if slack username is not informed, searches for his username by email
        slackUsername
      });
    }

    return await User.get({ uid });
  }

  validateEmail(email) {
    return /@irriga.net\s*$/.test(email) || /@sistemairriga.com.br\s*$/.test(email);
  }

  async auth({ access_token }) {
    return await this.getUid({ access_token });
  }



  async getUid({ access_token }) {
    const user = await firebase.auth().verifyIdToken(access_token);
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
