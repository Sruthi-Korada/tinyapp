const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const {getUserByEmail, checkPassword, isUsersLink, generateRandomString} = require("./helpers");




//-------------------------------------------middleware ------------------------------------------------------------//

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys:["poop"],
  maxAge: 24 * 60 * 60 * 1000
}));
app.set("view engine", "ejs");
//------------------------OBJECTs---------------------------------------------------------------------------//
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("test",10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk",10)
  },
  "user3RandomID": {
    id: "user3RandomID",
    email: "sruthikorada36@gmail.com",
    password: bcrypt.hashSync("zxcvbnm",10)
  }
};

//------------------------localhost"/"----------------------------------------------------------------------------//
app.get("/", function(req, res) {
  let cookie = req.session;
  let templateVars = {urls: isUsersLink(urlDatabase, cookie.user_id), user: users[cookie.user_id]};
  if (cookie.user_id) { //if logged in
    res.render("urls_index", templateVars);
  } else {  //if not logged in
    res.render("login", templateVars);
  }
});
// -------------------------------URLS -----------------------------------------------------------------//

app.get("/urls", function(req, res) {
  let cookie = req.session;
  // console.log("urls with id: ",cookie,users[cookie.user_id]);
  let templateVars = {urls: isUsersLink(urlDatabase, cookie.user_id), user: users[cookie.user_id]};
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  let cookie = req.session;
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  const genshortURL = generateRandomString();
  urlDatabase[genshortURL] = {
    longURL: req.body.longURL,
    userID: cookie.user_id
  };
  // console.log("for urls post :", urlDatabase);
  res.redirect(`/urls/${genshortURL}`);
});

//------------------------NEW URL-----------------//
app.get("/urls/new", function(req, res) {
  let cookie = req.session;
  //check if user is logged in
  if (cookie.user_id) {
    res.render("urls_new", {user: users[cookie.user_id]});
  } else {
    res.redirect("/login");
  }
});
//------------------------ URL WITH ID----------------------//
app.get("/urls/:shortURL", function(req, res) {
  let cookie = req.session;
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.render("urls_show", {longURL: longURL, shortURL: shortURL, user: users[cookie.user_id]});
});
app.post("/urls/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  res.redirect(`/urls/${short}`);
});
app.get("/u/:shortURL", function(req, res) {
  let shortURL = req.params.shortURL;
  console.log("u/short", shortURL, urlDatabase[shortURL])
  res.redirect("https://" + urlDatabase[shortURL].longURL);
});
//-----------------DELETE --------------------------------//
app.post("/urls/:shortURL/delete", (req, res) => {
  let short = req.params.shortURL;
  let cookie = req.session;
  let userLinks = isUsersLink(urlDatabase, cookie.user_id);
  // if we don't add this, anyone can delete a shortURL from their terminal using curl
  if (userLinks[short]) {
    delete urlDatabase[short];
    res.redirect("/urls");
  } else {
    res.send("You are not authorized to delete this link.");
  }
});


//-----------------------EDIT ------------------------------//
app.post("/urls/:shortURL/edit", (req, res) => {
  let cookie = req.session;
  let short = req.params.shortURL;
  let usersObj = isUsersLink(urlDatabase, cookie.user_id);
  //check if shortURL exists for current user:
  if (usersObj[short]) {
    urlDatabase[short] = {
      longURL: req.body.longURL,
      userID: cookie.user_id
    };
    res.redirect("/urls");
  } else {
    res.status(403).send("Error 403 - You do not have access to edit this link.");
  }
});
  
//--------------------login-------------------------------//


app.get("/login", (req, res) => {
  let cookie = req.session;
  res.render("login", {user: users[cookie.user_id]});
});
app.post("/login", function(req, res) {
  let userID = getUserByEmail(req.body.email,users);
  // console.log("post login :",req.body);
  let passwordCheck = checkPassword(req.body.email, req.body.password, users);
  // console.log("loginpwsck :",passwordCheck);
  if (userID && passwordCheck) {
    // res.cookie(`user_id`, userID);
    req.session.user_id = userID;
    req.session.save();
    res.redirect("/urls");
  } else {
    res.status(403).send(`Error 403 - Email/ Password entered is not valid!`);
  }
  
});
//---------------------logout----------//

app.post("/logout", function(req, res) {
  // console.log(req.cookies);
  req.session = null;
  res.redirect("/urls");
});

//----------------------------  REGISTER -------------------//

app.get("/register", (req, res) => {
  let cookie = req.session;
  res.render("register", {user: users[cookie.user_id]});
});

app.post("/register", function(req, res) {
  
  //if email already in use
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send(`Error 400 - Email or password needs to be entered!`);
  //if email or password
  } else if (getUserByEmail(req.body.email)) {
    res.status(400).send(`Error 400 - That email is already in use!`);
  } else {
    const hasedPassword = bcrypt.hashSync(req.body.password, 8);
    let userID = generateRandomString();
    users[userID] = {
      id: userID,
      email: req.body.email,
      password: hasedPassword
    };
  }
  // console.log(users);
  res.redirect("/login");
});


//------------------------- LISTEN ---------------------------



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});