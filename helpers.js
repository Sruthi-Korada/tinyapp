const getUserByEmail = function(email, users, select) { //gets pass or userid by email
    const userKeys = Object.keys(users);
    let usr = undefined;
    let pass = undefined;
    for (let user of userKeys) {
      if (users[user].email === email) {
        usr = users[user].id;
        pass = users[user].password;
      }
    }
    switch (select) {
      case 1:
        return usr;
        break;
      case 2:
        return pass;
        break;
      default:
        return usr;
    }
  };
  
  function generateRandomString(n) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let short = '';
    for (let i = 0; i < n; i++) {
      const random = Math.floor(Math.random() * 62);
      short += chars[random];
    }
    return short;
  };
  // check if email exist in database
  const checkEmail = function(email, users) {
    const usersKey = Object.keys(users);
    // console.log(usersKey," <---> ",email);
    // const getEmail = users.find(emailFound => users[id].email === email);
    for (let user of usersKey) {
      // console.log(user, " email = ", users[user].email);
      if (users[user].email === email) {
        return true;
      } else {
        // console.log('content user[user].email = ', users[user].email);
        // return false;
      }
    }
    return false;
  };
  
  const urlsForUser = function(id, urlDatabase) {
    const urlsKeys = Object.keys(urlDatabase);
    let tempVars = {};
    for (let url of urlsKeys) {
      if (urlDatabase[url].userID === id) {
        tempVars[url] = urlDatabase[url].longURL;
      }
    }
    return tempVars;
  };
  
  module.exports = { getUserByEmail, generateRandomString, checkEmail, urlsForUser }