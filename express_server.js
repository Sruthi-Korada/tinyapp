const express = require("express");
const app = express();
const PORT = 8080; // default port 8080


app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  function checkPassword(email, password) {
    for (let user in users) {
      if (users[user].email === email && users[user].password === password) {
        return users[user].id;
      }
    }
  }

  const emailExists = function (email, users) {
    for (const user in users) {
      if (users[user]['email'] === email) {
        return true;
      }
    }
    return false;
  };


//------------------ GET METHOD ----------------------------------------------------------------------------------

   app.get("/urls/new", (req, res) => {
    let templateVars = {
      user_id : req.cookies['user_id']
    };
    res.render("urls_new", templateVars);                  // ====> giving new url ejs "adding new html css attribute"
  });
  app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL] ,
      user_id : req.cookies['user_id'] };
    res.render("urls_show", templateVars );
  });

  app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL]
    res.redirect(longURL);
  });
 



  // -------------------------------URLS -----------------------------------------------------------------//

  // app.post("/urls", (req, res) => {
  //   console.log(req.body);  // Log the POST request body to the console
  //   res.send("Ok");         // Respond with 'Ok' (we will replace this)
  // });
  
  app.get("/urls", (req,res) => {
    let passData = {
      user_id : req.cookies['user_id'],
      urls : urlDatabase
                    };
    res.render('urls_index', passData);
  });
  app.post("/urls", (req, res) => {
    shortURL = generateRandomString();
    longURL = req.body.longURL;
    urlDatabase[shortURL] = longURL;
    res.redirect(`/urls/${shortURL}`);
  });

  //-----------------DELETE --------------------------------//
  app.post("/urls/:shortURL/delete", (req, res) => {
    let key = req.params.shortURL
    delete urlDatabase[key];
    res.redirect("/urls");
  });


  //-----------------------EDIT ------------------------------//
  app.post('/urls/:shortURL', (req, res) => {
    urlDatabase[req.params.shortURL]["longURL"] = req.params.longURL;
      res.redirect(`/urls/${req.params.shortURL}`);
  });


//----------------submit------------------------------//


// Update a longURL resource
app.post("/urls/:shortURL/edit", (req, res) => {
  let key = req.params.shortURL;
  urlDatabase[key] = req.body.newlongURL;
  res.redirect(`/urls/${key}`);
})


//--------------------login-------------------------------//


app.get('/login', (req, res) => {
  let passData = {
    user_id : req.cookies['user_id'],
    urls : urlDatabase
                  };
  res.render('login.ejs', passData);
});

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
  let passData = {
    user_id : req.cookies['user_id'],
    urls : urlDatabase
                  };
  res.render("register",passData);
});



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

