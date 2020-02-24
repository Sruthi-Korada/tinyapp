const express = require("express"); //initialize express
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
app.set("view engine", "ejs");  //set ejs as the view engine
//------------------------OBJECTs---------------------------------------------------------------------------//
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },      //all long urls and their generated short URLs
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
//all users (from registration page)
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
// Homepage takes you to your urls if you are logged in or to the login page:
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
// Urls page showing user's generated short/ long URLs:
app.get("/urls", function(req, res) {
  let cookie = req.session;
  let templateVars = {urls: isUsersLink(urlDatabase, cookie.user_id), user: users[cookie.user_id]};
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  let cookie = req.session;
  const genshortURL = generateRandomString();
  urlDatabase[genshortURL] = {
    longURL: req.body.longURL,
    userID: cookie.user_id
  };
  res.redirect(`/urls/${genshortURL}`);
});

//------------------------NEW URL-----------------//
// Generate a new short URL from a long URL
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

// Short url visitors log
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
// Login page

app.get("/login", (req, res) => {
  let cookie = req.session;
  res.render("login", {user: users[cookie.user_id]});
});

app.post("/login", function(req, res) {
    // if email and password are valid, set the cookie's user_id
  // console.log(req.cookies);
  let userID = getUserByEmail(req.body.email,users);//returns user id
  let passwordCheck = checkPassword(req.body.email, req.body.password, users);
  if (userID && passwordCheck) {
    req.session.user_id = userID;
    req.session.save();
    res.redirect("/urls");
  } else {
    res.status(403).send(`Error 403 - Email/ Password entered is not valid!`);
  }
  
});
//---------------------logout----------//

app.post("/logout", function(req, res) {
    //only clear the user_id cookie, not the browser
  req.session = null;
  res.redirect("/urls");
});

//----------------------------  REGISTER -------------------//
// register page
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
  res.redirect("/login");
});


//------------------------- LISTEN ---------------------------



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});