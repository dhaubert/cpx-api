const firebase = require("firebase-admin");
const User = require("./UserController");

class AuthController {
  constructor() {}

  async signin({ uid, email, displayName, providerId, phoneNumber, photoURL, slackUsername, refreshToken }) {
    // checks the information received

    if (!this.validateEmail(email)){
      throw { message: `Email ${email} is not part of irriga.net.`, statusCode: 403 };
    }

    if (!this.getUid({ refreshToken })){
      throw { message: `User is not logged in on Google.`, statusCode: 401 };
    }

    // if the user doesn't exist, create a new one
    const alreadyExists = await User.exists({ uid });

    if (!alreadyExists) {
      return User.add({
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
    return /@irriga.net\s*$/.test(email);
  }

  auth({ refreshToken }) {
    return this.getUid({ refreshToken });
  }

  getUid({ refreshToken }) {
    firebase
      .auth()
      .verifyIdToken(refreshToken)
      .then(function(decodedToken) {
        console.log("decodedToken", decodedToken);
        let uid = decodedToken.uid;
        // ...
      })
      .catch(function(error) {
        // Handle error
        console.log("An error happened finding user: ", error);
      });

      return true;
  }

  createUser() {
    const uid = "douglas-121112f12f";
    const additionalClams = {
      isAdmin: true
    };

    // {
    //   "rules":
    //     "premiumContent": {
    //       ".read": "auth.token.premiumAccount === true"
    //     }
    // }

    firebase
      .auth()
      .createCustomToken(uid, additionalClams)
      .then(customToken => {
        console.log("customToken", customToken);
      })
      .catch(error => {
        console.log("error:", error);
      });
  }
}

module.exports = new AuthController();
