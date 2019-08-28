const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert("./google-key.json"),
  databaseURL: "https://ww-w-data.firebaseio.com"
});
const db = admin.database();

/**
 * {
 *   test: {
 *     users: {
 *       douglas: {
 *         full_name: 'Douglas Haubert',
 *         money: 0
 *       },
 *       henrique:{
 *         full_name: 'Henrique Haubert',
 *         money: 0
 *       }
 *     }
 *   }
 * }
 *
 */
// -- read all the data once
// const myUser = db.ref(`/teste/users/douglas`);
// myUser.once('value', data  => {
//   console.table(data.val())
// });

// -- reads data one by one, at first, then watchs for new users
// const myUser = db.ref(`/teste/users/`);
// myUser.on('child_added', (child) => {
//   console.table(child.val());
// });

// -- update user fullname
// const myUser = db.ref(`/teste/users/`);
// const dataUpdate = { douglas: { full_name: "Douglas Haubert", money: 1 } };
// myUser.update(dataUpdate, (response) => {
//   console.log(response == null? 'Success' : 'Failed');
// });

// -- set user new structure (replaces all the childs in the ref)
// const myUser = db.ref('/teste/users/douglas');
// const dataReplace =  { full_name: "Douglas Haubert", birthDate: '1992-11-07', money: 1 } ;
// myUser.set(dataReplace);

// -- atomic transaction over a new value
async function testTransaction() {
  const usernameFrom = 'douglas';
  const usernameTo = 'frodo';
  const userFrom = db.ref(`/teste/users/${usernameFrom}/money`);
  const transferAmount = 1;
  const fromReturn = await userFrom.transaction(
    currentMoneyFrom => {
      console.log('currentMoneyFrom', currentMoneyFrom);
      const newBalance = currentMoneyFrom - transferAmount;
      const notEnoughFunds = newBalance < 0;
      if (currentMoneyFrom === null) {
        return false;
      } else if (notEnoughFunds) {
        return;
      } 
      return newBalance;
    }
  );
  console.log('from', fromReturn);
  console.log(fromReturn.committed? 'balance updated': 'not enough money')
  console.log('currentValue:', fromReturn.snapshot.val())

  if (fromReturn.committed && fromReturn.snapshot.val() >= 0) {
    const userTo = db.ref(`/teste/users/${usernameTo}/money`);
    const toReturn = await userTo.transaction(
    currentMoneyTo => {
      if(currentMoneyTo === null){
        currentMoneyTo = 0;
      } 
      return currentMoneyTo + transferAmount;
    }
  );
  console.log(
    toReturn.committed? 
      `balance TO updated (${toReturn.snapshot.val()})`: 
      'not enough money TO')
  } else {
    console.log('Not enough funds to transfer.')
  }
}
testTransaction();
