
const bcrypt = require("bcrypt");

//-------function returns a string of 6 alphanumeric characters---------
function generateRandomString() {
  let rString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += rString[Math.floor(Math.random() * rString.length)];
  }
  return result;
}
  
// //-----returns true if email already exists in database-------
function getUserByEmail(email, users) {
   for (let user in users) {
     if (users[user].email === email) {
       return users[user].id;
     }
   }
   return false;
 }

//-------------------check password-----------------
function checkPassword(email, password, users) {
  console.log("checkpsw function",email,password,users);

  for (let user in users) {
    if (users[user].email === email) {
      console.log(email,password,user);
      return bcrypt.compareSync(password, users[user].password);
    }
  }
}

//------------------- isUserLink-------------------//
//check if link belongs to user
function isUsersLink(object, id) {
  let returned = {};
  for (let obj in object) {
    if (object[obj].userID == id) {
      returned[obj] = object[obj];
    }
  }
  return returned;
}

module.exports = {getUserByEmail, checkPassword, isUsersLink, generateRandomString};