const firebase = require("../utils/firebase");
const User = require("./UserController");

class AuthController {
  constructor() {}

  async signin({ uid, email, displayName, providerId, phoneNumber, photoURL, slackUsername, access_token }) {
    // checks the information received

    if (!this.validateEmail(email)){
      throw { message: `Email ${email} is not part of irriga.net or sistemairriga.com.br.`, statusCode: 403 };
    }
    console.log('refreshToken::', access_token);
    const userPayload = await this.getUid({ access_token });
    if (!userPayload){
      throw { message: `User is not logged in on Google.`, statusCode: 401 };
    }

    // if the user doesn't exist, create a new one
    User.uid = uid;
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

    console.log('User already exists', User.get());
    return await User.get({ uid });
  }

  validateEmail(email) {
    return /@irriga.net\s*$/.test(email) || /@sistemairriga.com.br\s*$/.test(email);
  }

  auth({ access_token }) {
    return this.getUid({ access_token });
  }



  getUid({ access_token }) {
    // @todo: check https://firebase.google.com/docs/auth/admin/verify-id-tokens
    firebase
      .auth()
      .verifyIdToken(access_token)
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
