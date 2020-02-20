const express = require("express");
const app = express();
const PORT = 8080; // default port 8080


app.set("view engine", "ejs");


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
//-------------------------------------------middleware ------------------------------------------------------------//
//-----------------body parser------------------------//

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//--------------------uses of cookie parser ----------------------//
const cookieParser = require("cookie-parser");
app.use(cookieParser())


//------------------------USER OBJECT---------------------------//
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
//---------------------------------random fuction used in post urls   and GLOBAL FUNCTION-----------------//

function generateRandomString() {
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i <= 5; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  //-----------checking password-----------//
  function checkPassword(email, password) {
    for (let user in users) {
      if (users[user].email === email && users[user].password === password) {
        return users[user].id;
      }
    }
  }
//-------email exits-----------------------------//
  const emailExists = function (email, users) {
    for (const user in users) {
      if (users[user]['email'] === email) {
        return true;
      }
    }
    return false;
  };

  //------------------- isUserLink-------------------//
  function isUsersLink(object, id) {
    let returned = {};
    for (let obj in object) {
      if (object[obj].userID == id) {
        returned[obj] = object[obj];
      }
    }
    return returned;
  }

//------------------------NEW URL-----------------//
app.get("/urls/new", (req, res) => {
  let cookie = req.cookies;
  //check if user is logged in
  if (cookie.user_id) {
    res.render("urls_new", {user: users[cookie.user_id]});
  } else {
    res.redirect("/login");
  }
})
//------------------------ URL WITH ID----------------------//
app.get("/urls/:shortURL", (req, res) => {
  let cookie = req.cookies;
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.render("urls_show", {longURL: longURL, shortURL: shortURL, user: users[cookie.user_id]});
})
app.get("/u/:shortURL", function(req, res) {
  let shortURL = req.params.shortURL;
  res.redirect(urlDatabase[shortURL].longURL);
})
  // -------------------------------URLS -----------------------------------------------------------------//

  app.get("/urls", function(req, res) {
    let cookie = req.cookies;
    let templateVars = {urls: isUsersLink(urlDatabase, cookie.user_id), user: users[cookie.user_id]};
    res.render("urls_index", templateVars);
  })
  app.post("/urls", (req, res) => {
    let cookie = req.cookies;
    const genshortURL = generateRandomString();
    urlDatabase[genshortURL] = {
      longURL: req.body.longURL, 
      userID: cookie.user_id
    };
    console.log(urlDatabase);
    res.redirect(`/urls/${genshortURL}`);
  });
  //-----------------DELETE --------------------------------//
  app.post("/urls/:shortURL/delete", (req, res) => {
    let short = req.params.shortURL;
    let cookie = req.cookies;
    let userLinks = isUsersLink(urlDatabase, cookie.user_id);
    if (userLinks[short]) {
      delete urlDatabase[short];
      res.redirect("/urls");
    } else {
      res.send("You are not authorized to delete this link.");
    }
  })


  //-----------------------EDIT ------------------------------//
  app.post("/urls/:shortURL/edit", (req, res) => {
    let cookie = req.cookies;
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
  })


//--------------------login-------------------------------//


app.get("/login", (req, res) => {
  let cookie = req.cookies;
  res.render("login", {user: users[cookie.user_id]});
})
  app.post("/login", (req, res) => {
    console.log(req.cookies);
    let userID = checkPassword(req.body.email, req.body.password);
    if (userID) {
      res.cookie(`user_id`, userID);
    } else {
      res.status(403).send(`Error 403 - Email/ Password entered is not valid!`);
    }
    res.redirect("/urls");
  });
//---------------------logout----------//

app.get("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//----------------------------  REGISTER -------------------//

app.get("/register", (req, res) => {
  let cookie = req.cookies;
  res.render("register", {user: users[cookie.user_id]});
})

app.post("/register", (req, res) => {
  if (emailExists(req.body.email, users)) {
    res.statusCode = 400;
    res.send("Email already exists!")
  } else {
    if (req.body.email === "" || req.body.password === "") {
      res.statusCode = 400;
      res.send("Please fill in both email and password to log in.")
    } else {
      const id = generateRandomString();
      users[id] = { id: id, email: req.body.email, password:req.body.password };
      res.cookie("user_id", id);
      res.redirect("/urls");
    }
  }
});
//------------------------- LISTEN ---------------------------



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

